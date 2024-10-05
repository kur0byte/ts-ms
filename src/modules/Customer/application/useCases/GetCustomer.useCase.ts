import {ICustomerRepository} from '@Customer/domain/ICustomerRepository';
import {CustomerDTO} from '@Customer/application/dto/Customer.dto';
import {TYPES} from '@config/dic/types';
import {inject, injectable} from 'inversify';
import {Repository} from 'typeorm';
import {Customer} from '@Customer/domain/Customer';
import {CustomerTypeOrmRepository} from '@Customer/infrastructure/CustomerTypeOrm.repository';

@injectable()
export class GetCustomerUseCase {
  constructor(
    @inject(TYPES.CustomerTypeOrmRepository)
    private CustomerTypeOrmRepository: CustomerTypeOrmRepository
  ) {}

  async execute(): Promise<Customer[] | null> {
    console.log(await this.CustomerTypeOrmRepository.Repository.find());
    const customer = await this.CustomerTypeOrmRepository.Repository.find();
    if (!customer) return null;

    return customer;
  }
}
