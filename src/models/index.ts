import config from '@/config/databases';
import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const envConfig = config[env as keyof typeof config];

const sequelize = envConfig.url
  ? new Sequelize(envConfig.url, envConfig)
  : new Sequelize(envConfig.database as string, envConfig.username as string, envConfig.password, envConfig);

export { Sequelize, sequelize };
