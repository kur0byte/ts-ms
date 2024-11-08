import {injectable} from 'inversify';

@injectable()
export class HttpConfig {
  public readonly port: number = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3000;
  public readonly host: string = '';
}
