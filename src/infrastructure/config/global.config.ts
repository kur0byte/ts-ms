import {injectable} from 'inversify';

@injectable()
export class globalConfig {
  public readonly environment: string = 'production';
}
