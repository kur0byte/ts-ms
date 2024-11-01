// import {Customer} from '@Customer/domain/Customer';
import {DataSource} from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'myapp',
  synchronize: true,
  logging: false,
  entities: [],
  subscribers: [],
  migrations: [],
});

export const initDatabase = async () => {
  AppDataSource.initialize()
    .then(() => {
      console.log('Database is connected');
    })
    .catch(error => console.log(error));
};
