import {inject, injectable} from 'inversify';
import {LoggerService} from '@shared/logger/logger';
import {HTTPBaseServer} from '@shared/server/HTTPBaseServer.abstract';
import {CustomerHTTPRoutes} from '@Customer/presentation/Customer.routes';

@injectable()
export class HTTPMicroserviceServer extends HTTPBaseServer {
  constructor(
    @inject(LoggerService) logger: LoggerService,
    @inject(CustomerHTTPRoutes)
    private readonly customerHTTPRoutes: CustomerHTTPRoutes
  ) {
    super(logger);
    this.configureRoutes();
  }

  protected configureDomainRoutes(): void {
    if (!this.customerHTTPRoutes) {
      throw new Error('CustomerHTTPRoutes not found');
    }
    this.server.use('/customers', this.customerHTTPRoutes.router);
  }
}
