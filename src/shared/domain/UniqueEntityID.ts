import {v4 as uuidv4} from 'uuid';

export class UniqueEntityID {
  constructor(private value: string = uuidv4()) {}

  equals(id?: UniqueEntityID): boolean {
    if (!(id instanceof UniqueEntityID)) return false;
    return this.toValue() === id.toValue();
  }

  toString(): string {
    return this.value;
  }

  toValue(): string {
    return this.value;
  }
}
