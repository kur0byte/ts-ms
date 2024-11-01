import {inject, injectable} from 'inversify';
import {LoggerService} from '../../../shared/logger/logger';
import {HTTPBaseServer} from '../../../shared/server/HTTPBaseServer.abstract';

@injectable()
export class HTTPMicroserviceServer extends HTTPBaseServer {
  constructor(@inject(LoggerService) logger: LoggerService) {
    super(logger);
    this.configureRoutes();
  }

  protected configureDomainRoutes(): void {}
}
