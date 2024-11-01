import {Container} from 'inversify';

import {HTTPMicroserviceServer} from '../../infrastructure/http/express/server';

import {LoggerService} from '../../shared/logger/logger';
import {HTTPBaseServer} from '../../shared/microservers/HTTPBaseServer.abstract';

import {RequestLoggerMiddleware} from '../../shared/middleware/requestLogger-middleware';
import {CorrelationIdMiddleware} from '../../shared/middleware/correlationId.middleware';
import {ErrorHandlingMiddleware} from '../../shared/middleware/errorHandling.middleware';

const container = new Container({autoBindInjectable: true});

// Middlewares
container.bind<RequestLoggerMiddleware>(RequestLoggerMiddleware).toSelf();
container.bind<CorrelationIdMiddleware>(CorrelationIdMiddleware).toSelf();
container.bind<ErrorHandlingMiddleware>(ErrorHandlingMiddleware).toSelf();

// Logger
container.bind<LoggerService>(LoggerService).toSelf();

// Server
container
  .bind<HTTPBaseServer>(HTTPBaseServer)
  .to(HTTPMicroserviceServer)
  .inSingletonScope();
container
  .bind<HTTPMicroserviceServer>(HTTPMicroserviceServer)
  .toSelf()
  .inSingletonScope();

// Routes
// container
//   .bind<CustomerHTTPRoutes>(CustomerHTTPRoutes)
//   .toSelf()
//   .inSingletonScope();

// Controllers
// container
//   .bind<CustomerController>(TYPES.CustomerController)
//   .to(CustomerController);

// // Use Cases
// container
//   .bind<CreateCustomerUseCase>(CreateCustomerUseCase)
//   .to(CreateCustomerUseCase);
// container
//   .bind<GetCustomerUseCase>(TYPES.GetCustomerUseCase)
//   .to(GetCustomerUseCase);

// // Repositories
// container
//   .bind<CustomerTypeOrmRepository>(TYPES.CustomerTypeOrmRepository)
//   .to(CustomerTypeOrmRepository);
// container
//   .bind<ICustomerRepository>(TYPES.CustomerRepository)
//   .to(CustomerRepository);

container.load();
export {container as iocContainer};
