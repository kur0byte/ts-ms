import {Request, Response, NextFunction} from 'express';
import {injectable, inject} from 'inversify';
import {LoggerService} from '../logger/logger';
import {randomUUID} from 'crypto';

@injectable()
export class RequestLoggerMiddleware {
  constructor(@inject(LoggerService) private readonly logger: LoggerService) {
    this.handle = this.handle.bind(this);
  }

  public handle(req: Request, res: Response, next: NextFunction): void {
    const requestId = randomUUID();
    const startTime = process.hrtime();

    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);

    // Create log context
    const logContext = {
      requestId,
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      headers: {
        ...req.headers,
        authorization: '[REDACTED]',
      },
      body: this.sanitizeBody(req.body),
      userAgent: req.get('user-agent'),
      ip: req.ip,
    };

    // Log request
    this.logger.http('Incoming request', logContext);

    // Log response
    res.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const duration = seconds * 1000 + nanoseconds / 1000000;

      this.logger.http('Request completed', {
        ...logContext,
        statusCode: res.statusCode,
        duration: `${duration.toFixed(2)}ms`,
        responseHeaders: res.getHeaders(),
      });
    });

    next();
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = {...body};
    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
