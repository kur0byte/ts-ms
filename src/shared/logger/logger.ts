import {injectable} from 'inversify';
import winston, {Logger, format} from 'winston';
import {LoggingWinston} from '@google-cloud/logging-winston';
import 'winston-daily-rotate-file';
import {randomUUID} from 'crypto';
import path from 'path';

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
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;

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

        if (metadata.error?.stack) {
          msg += `\nError: ${metadata.error.stack}`;
        }

        return msg;
      })
    );

    // Configure transports based on environment
    const transports: winston.transport[] = [];

    // Always add console transport
    transports.push(
      new winston.transports.Console({
        level: environment === 'production' ? 'info' : 'debug',
        format: environment === 'production' ? customFormat : consoleFormat,
      })
    );

    // Add Google Cloud Logging in production
    if (environment === 'production' && projectId) {
      const googleLogging = new LoggingWinston({
        keyFilename: path.join(__dirname, '../../../gcp_iam_key.json'),
        projectId,
        logName: 'ts-microservice',
        serviceContext: {
          service: process.env.SERVICE_NAME || 'ts-microservice',
          version: process.env.VERSION || 'unknown',
        },
        resource: {
          type: 'cloud_run_revision',
          labels: {
            service_name: process.env.SERVICE_NAME || 'ts-microservice',
            revision_name: process.env.K_REVISION || 'unknown',
            location: process.env.CLOUD_RUN_LOCATION || 'unknown',
          },
        },
        labels: {
          environment,
        },
      });

      transports.push(googleLogging);
    }

    // Add file transport in production (for backup/local access)
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

  private formatMessage(message: string, context?: LogContext): any {
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

  private addSourceLocation(error?: Error): any {
    if (!error) return {};

    const stack = error.stack?.split('\n')[1];
    if (!stack) return {};

    const match = stack.match(/at\s+(.+)\s+\((.+):(\d+):(\d+)\)/);
    if (!match) return {};

    return {
      'logging.googleapis.com/sourceLocation': {
        file: match[2],
        line: match[3],
        function: match[1],
      },
    };
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(this.formatMessage(message, context));
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(this.formatMessage(message, context));
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(this.formatMessage(message, context));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(
      this.formatMessage(message, {
        ...context,
        error: error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : undefined,
        ...this.addSourceLocation(error),
      })
    );
  }

  http(message: string, context?: LogContext): void {
    this.logger.http(this.formatMessage(message, context));
  }
}
