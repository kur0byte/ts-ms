import {PrimaryGeneratedColumn} from 'typeorm';
import {UniqueEntityID} from './UniqueEntityID';

export abstract class DomainEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  protected readonly _id: UniqueEntityID;
  public readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    this._id = id || new UniqueEntityID();
    this.props = props;
  }

  public equals(object?: DomainEntity<T>): boolean {
    if (object === null) return false;
    if (this === object) return true;
    if (!(object instanceof DomainEntity)) return false;
    return this._id.equals(object._id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }
}
