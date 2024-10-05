// src/customer/domain/ICustomerRepository.ts
import {UniqueEntityID} from '@shared/domain/UniqueEntityID';
import {Customer} from './Customer';

export interface ICustomerRepository {
  findById(id: UniqueEntityID): Promise<Customer | null>;
  find(): Promise<Customer | null>;
  save(customer: Customer): Promise<void>;
}
