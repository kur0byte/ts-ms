import {injectable} from 'inversify';
import {HTTPBaseServer} from '../../../shared/microservers/HTTPBaseServer.abstract';

@injectable()
export class HTTPMicroserviceServer extends HTTPBaseServer {
  constructor() {
    super();
    this.configureServer();
  }

  protected configureCustomRoutes(): void {
    this.server.get('/hello', (req, res) => {
      res.send('Hello World!');
    });
  }

  public configureCustomMiddleware(): void {}
}
