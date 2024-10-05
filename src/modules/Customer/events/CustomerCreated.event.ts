// src/customer/domain/events/CustomerCreatedEvent.ts
import {DomainEvent} from '@shared/domain/DomainEvent';
import {Customer} from '@Customer/domain/Customer';
import {UniqueEntityID} from '@shared/domain/UniqueEntityID';

export class CustomerCreatedEvent implements DomainEvent {
  public dateTimeOccurred: Date;
  public customer: Customer;
  public customerId: UniqueEntityID;

  constructor(customerId: UniqueEntityID, customer: Customer) {
    this.dateTimeOccurred = new Date();
    this.customer = customer;
    this.customerId = customerId;
  }

  getAggregateId(): UniqueEntityID {
    return this.customerId;
  }
}
