import 'reflect-metadata';
import {Container} from 'inversify';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import express, {json, urlencoded} from 'express';
import openapi from '../../../docs/openapi.json';
import {CustomerHTTPRoutes} from '@Customer/presentation/Customer.routes';

export class ExpressServer {
  private server: express.Application;
  private container: Container;

  constructor(container: Container) {
    this.server = express();
    this.container = container;
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.server.use(
      urlencoded({
        extended: true,
      })
    );
    this.server.use(json());
  }

  private configureRoutes(): void {
    this.server.use(
      '/docs/api',
      swaggerUi.serve,
      async (_req: any, res: any) => {
        return res.send(swaggerUi.generateHTML(openapi));
      }
    );
    this.server.use(
      '/docs/redoc',
      express.static(path.join(__dirname, '../../../docs/redoc.html'))
    );
    this.server.use(
      '/docs/typedoc',
      express.static(path.join(__dirname, '../../../docs/typedoc'))
    );
    //TODO: create DI for route/microservice injection
    this.server.use(
      '/customers',
      CustomerHTTPRoutes(this.server, this.container)
    );
  }

  public start(): void {
    const port = process.env.PORT || 3000;
    this.server.listen(port, () =>
      console.log(`Example app listening at http://localhost:${port}`)
    );
  }
}

export default ExpressServer;
