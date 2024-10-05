import {Customer} from '@Customer/domain/Customer';
import {ICustomerRepository} from '@Customer/domain/ICustomerRepository';
import {AppDataSource} from '../../../infrastructure/db';
import {Repository} from 'typeorm';
import {injectable} from 'inversify';

@injectable()
export class CustomerTypeOrmRepository {
  private repository: Repository<Customer>;

  constructor() {
    try {
      this.repository = AppDataSource.getRepository(Customer);
    } catch (error) {
      console.error('Failed to initialize the repository:', error);
      throw new Error('Repository initialization failed');
    }
  }

  get Repository(): Repository<Customer> {
    if (!this.repository) {
      throw new Error('Repository is not initialized');
    }
    return this.repository;
  }
}
