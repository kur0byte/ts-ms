import {inject, injectable} from 'inversify';
import {LoggerService} from '../logger/logger';
import {NextFunction, Response, Request} from 'express';

@injectable()
export class ErrorHandlingMiddleware {
  constructor(@inject(LoggerService) private readonly logger: LoggerService) {
    this.handle = this.handle.bind(this);
  }

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
