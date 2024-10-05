import {inject, injectable} from 'inversify';
import {TYPES} from '@config/dic/types';
import {CreateCustomerUseCase} from '@Customer/application/useCases/CreateCustomer.useCase';
import {GetCustomerUseCase} from '@Customer/application/useCases/GetCustomer.useCase';
import {CreateCustomerDTO} from '@Customer/application/dto/CreateCustomer.dto';

@injectable()
export class CustomerController {
  constructor(
    @inject(TYPES.CreateCustomerUseCase)
    private createCustomerUseCase: CreateCustomerUseCase,
    @inject(TYPES.GetCustomerUseCase)
    private GetCustomerUseCase: GetCustomerUseCase
  ) {}

  /**
   * @swagger
   * /customers:
   *  post:
   *   description: Create a new customer
   *   requestBody:
   *     description: Customer data
   *     content:
   *       'application/json':
   *         schema:
   *           $ref: '#/components/schemas/CreateCustomerDTO'
   *   responses:
   *     201:
   *       description: Created
   *       content:
   *         application/json:
   *           example: {"id": "1", created_at: "2021-09-01T00:00:00.000Z"}
   *     400:
   *       description: Bad Request
   *       content:
   *         application/json:
   *           example: {"error": "Customer already exists"}
   *
   *   security:
   *     - apiKeyAuth: []
   */
  async createCustomer(req: any, res: any): Promise<void> {
    try {
      const body: CreateCustomerDTO = req.body;
      const customer = await this.createCustomerUseCase.execute(body);
      res.status(201).json(customer);
    } catch (error: any) {
      res.status(400).json({error: error.message});
    }
  }

  /**
   * @swagger
   * /customers:
   *  get:
   *   description: Get all customers
   *   responses:
   *     200:
   *       description: Success
   *       content:
   *         application/json:
   *           example: [{"id": "1", "name": "John Doe", "email": "", "address": ""}]
   */
  async getCustomers(req: any, res: any): Promise<void> {
    try {
      const customers = await this.GetCustomerUseCase.execute();
      res.status(200).json(customers);
    } catch (error: any) {
      res.status(400).json({error: error.message});
    }
  }
}
