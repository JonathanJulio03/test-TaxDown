import config from '@config/index'
import { CustomerEntity } from '@entities/customer-entity'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: config.database.dialect,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: true,
  entities: [CustomerEntity]
})