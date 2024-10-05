import {Customer} from '@Customer/domain/Customer';
import {ICustomerRepository} from '@Customer/domain/ICustomerRepository';
import {CustomerMapper} from './CustomerMapper';
import {TYPES} from '@config/dic/types';
import {injectable} from 'inversify';
import {UniqueEntityID} from '@shared/domain/UniqueEntityID';

@injectable()
export class CustomerRepository implements ICustomerRepository {
  private customers: Map<string, any> = new Map();

  async findById(id: UniqueEntityID): Promise<Customer | null> {
    const customerData = this.customers.get(id.toString());
    return customerData ? CustomerMapper.toDomain(customerData) : null;
  }

  async find(): Promise<Customer | null> {
    const customerData = this.customers.entries();
    return customerData ? CustomerMapper.toDomain(customerData) : null;
  }

  async save(customer: Customer): Promise<void> {
    this.customers.set(
      customer.id.toString(),
      CustomerMapper.toPersistence(customer)
    );
  }
}
