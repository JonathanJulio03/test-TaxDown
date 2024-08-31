import config from '@config/index'
import { CustomerEntity } from '@entities/customer-entity'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_DIALECT || config.database.dialect,
  host: process.env.DATABASE_HOST || config.database.host,
  port: process.env.DATABASE_PORT || config.database.port,
  username: process.env.DATABASE_USERNAME || config.database.username,
  password: process.env.DATABASE_PASSWORD || config.database.password,
  database: process.env.DATABASE_NAME || config.database.database,
  synchronize: true,
  entities: [CustomerEntity]
})