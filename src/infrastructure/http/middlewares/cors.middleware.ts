import {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import {injectable} from 'inversify';

/**
 * Middleware to handle Cross-Origin Resource Sharing (CORS).
 *
 * This middleware sets the necessary headers to allow cross-origin requests.
 *
 * @class CorsMiddleware
 */
@injectable()
export class CorsMiddleware {
  /**
   * Creates an instance of CorsMiddleware.
   * Binds the handle method to the current instance.
   *
   * @constructor
   */
  constructor() {
    this.handle = this.handle.bind(this);
  }

  /**
   * Middleware handler function.
   *
   * @param req - The incoming request object.
   * @param res - The outgoing response object.
   * @param next - The next middleware function in the stack.
   */
  public handle = (req: Request, res: Response, next: NextFunction): void => {
    const corsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    };

    cors(corsOptions)(req, res, next);
    next();
  };
}
