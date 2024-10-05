import {CustomerController} from '@Customer/presentation/Customer.httpController';
import {TYPES} from '@config/dic/types';
import {Container} from 'inversify';
import express, {Application} from 'express';

export const CustomerHTTPRoutes = (
  server: Application,
  container: Container
) => {
  const customerController = container.get<CustomerController>(
    TYPES.CustomerController
  );
  const router = express.Router();

  router.get('/', (req, res) => customerController.getCustomers(req, res));
  router.post('/', (req, res) => customerController.createCustomer(req, res));

  return router;
};
