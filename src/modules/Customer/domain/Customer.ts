// src/customer/domain/Customer.ts
import {AggregateRoot} from '@shared/domain/AggregateRoot';
import {CustomerCreatedEvent} from '../events/CustomerCreated.event';
import {UniqueEntityID} from '@shared/domain/UniqueEntityID';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

export interface CustomerProps {
  _name: string;
  _email: string;
  _address: string;
  _createdAt?: Date;
  _updatedAt?: Date;
}

@Entity()
export class Customer extends AggregateRoot<CustomerProps> {
  @Column()
  _name = '';

  @Column()
  _email = '';

  @Column()
  _address = '';

  @Column()
  _createdAt?: Date;

  @Column()
  _updatedAt?: Date;

  private constructor(props: CustomerProps, id?: string) {
    super(props, new UniqueEntityID(id));
  }

  public static create(props: CustomerProps, id?: string): Customer {
    const customer = new Customer(props, id);
    customer.addDomainEvent(new CustomerCreatedEvent(customer.id, customer));
    customer.domainEvents.forEach(event =>
      console.log('Publishing event...', event)
    );
    return customer;
  }

  get name(): string {
    return this.props._name;
  }

  get email(): string {
    return this.props._email;
  }

  get address(): string {
    return this.props._address;
  }

  public updateName(name: string): void {
    this.props._name = name;
  }

  public updateEmail(email: string): void {
    this.props._email = email;
  }

  public updateAddress(address: string): void {
    this.props._address = address;
  }
}
