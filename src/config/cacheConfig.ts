export const cacheConfig = {
  enable: process.env.ALLOW_CACHE == 'true',
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : undefined,
    password: process.env.REDIS_PASSWORD,
  },
};
