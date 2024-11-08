import {Request, Response, NextFunction} from 'express';
import {injectable} from 'inversify';

/**
 * Middleware to handle Correlation ID for incoming requests.
 *
 * This middleware checks for an existing `X-Correlation-ID` header in the request.
 * If it doesn't exist, it generates a new UUID and sets it in the response header.
 * This helps in tracking and correlating requests across different services.
 */
@injectable()
export class CorrelationIdMiddleware {
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
    const correlationId = req.get('X-Correlation-ID') || crypto.randomUUID();
    res.set('X-Correlation-ID', correlationId);
    next();
  };
}
