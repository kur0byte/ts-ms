import {injectable} from 'inversify';
import winston, {Logger, format} from 'winston';
import 'winston-daily-rotate-file';
import {randomUUID} from 'crypto';

const {combine, timestamp, json, colorize, printf, errors} = format;

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  DEBUG = 'debug',
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  correlationId?: string;
  [key: string]: unknown;
}

@injectable()
export class LoggerService {
  private logger: Logger;

  constructor() {
    const environment = process.env.NODE_ENV || 'development';

    // Define custom format
    const customFormat = combine(
      timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
      errors({stack: true}),
      json()
    );

    // Define console format for development
    const consoleFormat = combine(
      colorize(),
      printf(({level, message, timestamp, ...metadata}) => {
        let msg = `${timestamp} [${level}]: ${message}`;

        if (metadata.requestId) {
          msg += ` [RequestId: ${metadata.requestId}]`;
        }

        if (metadata.error) {
          msg += `\nError: ${metadata.error.stack}`;
        }

        return msg;
      })
    );

    // Configure transports based on environment
    const transports = [];

    // Console transport (all environments)
    transports.push(
      new winston.transports.Console({
        level: environment === 'production' ? 'info' : 'debug',
        format: environment === 'production' ? customFormat : consoleFormat,
      })
    );

    // File transports (production only)
    if (environment === 'production') {
      // Application logs
      transports.push(
        new winston.transports.DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: customFormat,
          level: 'info',
        })
      );

      // Error logs
      transports.push(
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: customFormat,
          level: 'error',
        })
      );
    }

    // Create logger instance
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      defaultMeta: {
        service: process.env.SERVICE_NAME || 'ts-microservice',
        environment,
      },
      transports,
    });
  }

  private formatMessage(
    level: string,
    message: string,
    context?: LogContext
  ): any {
    const logEntry: {[key: string]: unknown} = {
      message,
      timestamp: new Date().toISOString(),
      requestId: context?.requestId || randomUUID(),
      ...context,
    };

    // Redact sensitive information
    const sensitiveFields = ['password', 'secret', 'token', 'authorization'];
    for (const field of sensitiveFields) {
      if (logEntry[field]) {
        logEntry[field] = '[REDACTED]';
      }
    }

    return logEntry;
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(this.formatMessage('debug', message, context));
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(
      this.formatMessage('error', message, {
        ...context,
        error: error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : undefined,
      })
    );
  }

  http(message: string, context?: LogContext): void {
    this.logger.http(this.formatMessage('http', message, context));
  }
}
