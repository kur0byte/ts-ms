import {injectable, inject, Container} from 'inversify';
import {ConfigTypes} from './config.types';
import {TYPES} from '../../ioc/types';
import {config} from 'dotenv';
config();

@injectable()
export class ConfigService {
  constructor(@inject(TYPES.iocContainer) private container: Container) {}

  get<K extends keyof ConfigTypes>(key: K): ConfigTypes[K] {
    const typeKey = key as keyof typeof TYPES;
    if (!TYPES[typeKey]) {
      throw new Error(`No matching type found for key: ${key}`);
    }
    return this.container.get<ConfigTypes[K]>(TYPES[typeKey]);
  }
}
