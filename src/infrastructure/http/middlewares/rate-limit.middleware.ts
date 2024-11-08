import {Request, Response, NextFunction} from 'express';
import rateLimit from 'express-rate-limit';
import {injectable} from 'inversify';

/**
 * Middleware to handle rate limiting for incoming requests.
 *
 * @class RateLimitMiddleware
 */
@injectable()
export class RateLimitMiddleware {
  private rateLimiter: ReturnType<typeof rateLimit>;

  /**
   * Creates an instance of RateLimitMiddleware.
   * Binds the handle method to the current instance.
   *
   * @constructor
   */
  constructor() {
    const rateLimitOptions = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again after an hour',
    };
    this.rateLimiter = rateLimit(rateLimitOptions);
    this.handle = this.handle.bind(this);
  }

  /**
   * Handles the rate limiting for incoming requests.
   *
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function in the stack.
   * @returns {void}
   */
  handle(req: Request, res: Response, next: NextFunction): void {
    this.rateLimiter(req, res, next);
  }
}
