// import {injectable, inject} from 'inversify';
// import express from 'express';
// import {LoggerService} from '../../../shared/logger/logger';

// @injectable()
// export class CustomerHTTPRoutes {
//   public readonly router: express.Router;

//   constructor(@inject(LoggerService) private readonly logger: LoggerService) {
//     this.router = express.Router();
//     this.initializeRoutes();
//   }

//   private initializeRoutes() {
//     this.logger.http('[Customer Routes] Initializing');
//     this.router.get('/', (req, res) => {
//       res.send('Customer route');
//     });
//   }
// }
