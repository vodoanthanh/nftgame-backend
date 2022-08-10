import { Options } from 'sequelize'

export interface DatabaseConfig extends Options {
  url?: string
}