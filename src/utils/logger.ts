import fs from 'fs';
import winston, { Logger as LoggerWiston } from 'winston';
import 'winston-daily-rotate-file';

// logs dir
const logDir: string = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
class LoggerHelper {
  private data: { [path: string]: LoggerWiston; };

  constructor() {
    this.data = {};
  }

  getLogger(path: string = 'boom'): LoggerWiston {
    if (!this.data[path]) {
      this.data[path] = winston.createLogger({
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.errors({ stack: true }),
          winston.format.splat()
        )
      });

      this.data[path].add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.simple()
        ),
      }));

      this.data[path].add(new (winston.transports.DailyRotateFile)({
        dirname: logDir,
        filename: `${path}-%DATE%.log`,
        datePattern: 'MM-DD-HH',
        maxSize: '10m',
        maxFiles: '7d',
        format: winston.format.simple()
      }));
    }

    return this.data[path];
  }

  info(message: string, data?: any) {
    this.getLogger(data && data.path ? data.path : 'boom').info(message, data);
  }

  error(message: string, data?: any) {
    this.getLogger(data && data.path ? data.path : 'boom').error(message, data);
  }

  success(message: string, data?: any) {
    this.getLogger(data && data.path ? data.path : 'boom').info(message, data);
  }

  warning(message: string, data?: any) {
    this.getLogger(data && data.path ? data.path : 'boom').warn(message, data);
  }
}

const logger = new LoggerHelper();
const stream = {
  write: (message: string) => {
    logger.getLogger().info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream };

