import {Request, Response, NextFunction} from 'express';
import helmet from 'helmet';
import {injectable} from 'inversify';

/**
 * Middleware to handle security headers using Helmet.
 *
 * This middleware sets various HTTP headers to help protect the app from some well-known web vulnerabilities.
 */
@injectable()
export class HelmetMiddleware {
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
  public handle(req: Request, res: Response, next: NextFunction): void {
    helmet()(req, res, next);
    next();
  }
}
