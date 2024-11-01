// import {CreateCustomerDTO} from '@Customer/application/dto/CreateCustomer.dto';
// import {CustomerDTO} from '@Customer/application/dto/Customer.dto';
// import {Customer, CustomerProps} from '@Customer/domain/Customer';

// /**
//  * CustomerMapper is a class that is responsible for mapping the Customer domain entity to a DTO and vice versa.
//  * This class is used in the application layer to convert the domain entity to a DTO and vice versa.
//  *
//  * @class CustomerMapper
//  */
// export class CustomerMapper {
//   /**
//    * Converts a Customer domain entity to a DTO.
//    * @param customer
//    * @returns
//    */
//   public static toDTO(customer: Customer): CustomerDTO {
//     const props = customer.props;
//     return {
//       id: customer.id,
//       name: props._name,
//       email: props._email,
//       address: props._address,
//     };
//   }

//   /**
//    * Converts a raw object to a Customer domain entity.
//    * @param raw
//    * @returns
//    */
//   public static toDomain(raw: any): Customer {
//     const customerProps: CustomerProps = {
//       _name: raw.name,
//       _email: raw.email,
//       _address: raw.address,
//       _createdAt: new Date(raw.createdAt),
//       _updatedAt: new Date(raw.updatedAt),
//     };
//     const customer = Customer.create(customerProps, raw.id);
//     return customer;
//   }

//   /**
//    * Converts a DTO to a Customer domain entity.
//    * @param dto
//    * @returns
//    */
//   public static fromDTO(dto: CreateCustomerDTO): CustomerProps {
//     return {
//       _name: dto.name,
//       _email: dto.email,
//       _address: dto.address,
//       _createdAt: new Date(),
//       _updatedAt: new Date(),
//     };
//   }

//   /**
//    * Converts a Customer domain entity to a raw object.
//    * @param customer
//    * @returns
//    */
//   public static toPersistence(customer: Customer): any {
//     return {
//       name: customer.props._name,
//       email: customer.props._email,
//       address: customer.props._address,
//       createdAt: customer.props._createdAt,
//       updatedAt: customer.props._updatedAt,
//     };
//   }
// }
