// import {TYPES} from '@config/dic/types';
// import {inject, injectable} from 'inversify';
// import {ICustomerRepository} from '@Customer/domain/ICustomerRepository';
// import {CreateCustomerDTO} from '@Customer/application/dto/CreateCustomer.dto';
// import {Customer} from '@Customer/domain/Customer';
// import {UniqueEntityID} from '@shared/domain/UniqueEntityID';

// @injectable()
// export class CreateCustomerUseCase {
//   constructor(
//     @inject(TYPES.CustomerRepository)
//     private customerRepository: ICustomerRepository
//   ) {}

//   async execute(dto: CreateCustomerDTO): Promise<any> {
//     const customer = Customer.create(
//       {
//         _name: dto.name,
//         _email: dto.email,
//         _address: dto.address,
//       },
//       dto.id
//     );
//     await this.customerRepository.save(customer);
//     // return customer.id.toString();
//   }
// }
