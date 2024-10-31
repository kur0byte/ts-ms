import {Container} from 'inversify';
import {CreateCustomerUseCase} from '@Customer/application/useCases/CreateCustomer.useCase';
import {GetCustomerUseCase} from '@Customer/application/useCases/GetCustomer.useCase';
import {ICustomerRepository} from '@Customer/domain/ICustomerRepository';
import {CustomerRepository} from '@Customer/infrastructure/CustomerRepository';
import {CustomerController} from '@Customer/presentation/Customer.httpController';
import {TYPES} from '@config/dic/types';
import {CustomerTypeOrmRepository} from '@Customer/infrastructure/CustomerTypeOrm.repository';
import {LoggerService} from '@shared/logger/logger';
import {RequestLoggerMiddleware} from '@shared/middleware/request-logger-middleware';
import {HTTPBaseServer} from '@shared/server/HTTPBaseServer.abstract';
import {HTTPMicroserviceServer} from '../../infrastructure/http/express/server';
import {CustomerHTTPRoutes} from '@Customer/presentation/Customer.routes';

const container = new Container({autoBindInjectable: true});

// Middlewares
container
  .bind<RequestLoggerMiddleware>(RequestLoggerMiddleware)
  .toSelf()
  .inSingletonScope();

// Logger
container.bind<LoggerService>(LoggerService).toSelf().inSingletonScope();

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
container
  .bind<CustomerHTTPRoutes>(CustomerHTTPRoutes)
  .toSelf()
  .inSingletonScope();

// Controllers
container
  .bind<CustomerController>(TYPES.CustomerController)
  .to(CustomerController);

// Use Cases
container
  .bind<CreateCustomerUseCase>(TYPES.CreateCustomerUseCase)
  .to(CreateCustomerUseCase);
container
  .bind<GetCustomerUseCase>(TYPES.GetCustomerUseCase)
  .to(GetCustomerUseCase);

// Repositories
container
  .bind<CustomerTypeOrmRepository>(TYPES.CustomerTypeOrmRepository)
  .to(CustomerTypeOrmRepository);
container
  .bind<ICustomerRepository>(TYPES.CustomerRepository)
  .to(CustomerRepository);

container.load();
export {container as iocContainer};
