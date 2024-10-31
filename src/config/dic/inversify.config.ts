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

const container = new Container({autoBindInjectable: true});

// Logger
// Register logger service as singleton
container.bind<LoggerService>(LoggerService).toSelf().inSingletonScope();

// Register request logger middleware
container
  .bind<RequestLoggerMiddleware>(RequestLoggerMiddleware)
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
