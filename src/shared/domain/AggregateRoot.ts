import {DomainEvent} from './DomainEvent';
import {DomainEntity} from './DomainEntity';

export abstract class AggregateRoot<T> extends DomainEntity<T> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
