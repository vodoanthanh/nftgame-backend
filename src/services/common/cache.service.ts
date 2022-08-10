import { cacheConfig } from '@/config/cacheConfig';
import { logger } from '@/utils/logger';
import IORedis from 'ioredis';

export default class CacheService {
  static readonly LOG_PATH = 'CacheService';
  private static instance: CacheService;
  private redis: IORedis;

  private constructor() {
    this.redis = new IORedis({
      ...cacheConfig.redis,
      retryStrategy: (times: number) => {
        return Math.min(times * 100, 5000);
      },
      keyPrefix: 'cache:',
      enableReadyCheck: false,
      lazyConnect: true,
    });

    this.redis.on('error', (err) => {
      logger.error(err.message, {
        path: this.logPath(),
        data: {
          stack: err.stack
        }
      });
    });
  }

  logPath(): string {
    return this.constructor.name;
  }

  static getInstance() {
    if (cacheConfig.enable) {
      if (!CacheService.instance) {
        this.instance = new CacheService();
      }

      return this.instance;
    }

    return null;
  }

  getRedis(): IORedis {
    return this.redis;
  }

  stop() {
    this.redis.disconnect();
  }

  private async middleware<T>(cb: (redis: IORedis) => Promise<T>): Promise<T> {
    try {
      return await cb(this.redis);
    }
    catch (err: any) {
      logger.error(err.message, {
        path: this.logPath(),
        data: {
          stack: err.stack
        }
      });

      throw err;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.middleware<T | null>(async (redis: IORedis) => {
      const strData = await redis.get(key);

      try {
        if (strData) {
          const result: { _?: T; } = JSON.parse(strData);
          return result._ || null;
        }
      }
      catch (err: any) { }

      return null;
    });
  }

  async set<T>(key: string, data: T, expiredTime: number = 3600) {
    await this.middleware(async (redis: IORedis) => {
      const result = { _: data };
      await redis.set(key, JSON.stringify(result), 'EX', expiredTime);
    });
  }

  async remember<T>(key: string, cb: () => Promise<T>, expiredTime: number = 3600): Promise<T> {
    const cache = await this.get<T>(key);

    if (cache) {
      return cache;
    }

    const data = await cb();
    await this.set(key, data, expiredTime);

    return data;
  }

  async del(key: string) {
    await this.middleware(async (redis: IORedis) => {
      await redis.del(key);
    });
  }
}
