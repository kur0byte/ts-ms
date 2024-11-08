import {inject, injectable} from 'inversify';
import {LoggerService} from '../../observability/logging/logger';
import {NextFunction, Response, Request} from 'express';
import {TYPES} from '../../../shared/types';

@injectable()
export class ErrorHandlingMiddleware {
  constructor(
    @inject(TYPES.LoggerService) private readonly logger: LoggerService
  ) {
    this.handle = this.handle.bind(this);
  }

  /**
   * Middleware handler function for error handling.
   *
   * @param err - The error object.
   * @param req - The incoming request object.
   * @param res - The outgoing response object.
   * @param next - The next middleware function in the stack.
   */
  public handle(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    this.logger.error('Unhandled error occurred', err, {
      requestId: res.getHeader('X-Request-ID') as string,
      path: req.path,
      method: req.method,
    });

    res.status(500).json({
      error: 'Internal Server Error',
      requestId: res.getHeader('X-Request-ID'),
    });

    next(err);
  }
}
