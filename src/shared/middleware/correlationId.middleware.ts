import {Request, Response, NextFunction} from 'express';
import {injectable} from 'inversify';

@injectable()
export class CorrelationIdMiddleware {
  constructor() {
    this.handle = this.handle.bind(this);
  }

  public handle = (req: Request, res: Response, next: NextFunction): void => {
    const correlationId = req.get('X-Correlation-ID') || crypto.randomUUID();
    res.set('X-Correlation-ID', correlationId);
    next();
  };
}
