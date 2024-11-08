// src/config/configService.ts
import {inject, injectable} from 'inversify';
import {TYPES} from '../../../src/ioc/types';
import {DataSourceOptions} from 'typeorm';
import {LoggerService} from '../observability/logging/logger';

// interface Config {
//   [key: string]: DataSourceOptions;
// }

// const configurations: Config = {
//   default: {
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'myuser',
//     password: 'mypassword',
//     database: 'myapp',
//     synchronize: true,
//     logging: false,
//     entities: ['src/infrastructure/db/entities/**/*.ts'],
//     subscribers: [],
//     migrations: [],
//   },
// };

// export const getConfig = (module: string): DataSourceOptions => {
//   return configurations[module] || configurations.default;
// };

@injectable()
export class DatabaseConfig {
  constructor(
    @inject(TYPES.LoggerService) private readonly logger: LoggerService
  ) {}
  public readonly default: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'myuser',
    password: 'mypassword',
    database: 'myapp',
    synchronize: true,
    logging: true,
    entities: ['src/infrastructure/db/entities/**/*.ts'],
    subscribers: [],
    migrations: [],
  };
}
