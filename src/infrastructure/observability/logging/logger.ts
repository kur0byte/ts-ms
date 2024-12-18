import 'reflect-metadata';
import {injectable} from 'inversify';
import winston, {Logger, format} from 'winston';
import {LoggingWinston} from '@google-cloud/logging-winston';
import 'winston-daily-rotate-file';
import crypto from 'crypto';
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

function getEnvVar(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

const ENVIRONMENT = getEnvVar('NODE_ENV', 'development');
const PROJECT_ID = getEnvVar('GOOGLE_CLOUD_PROJECT', '');
const SERVICE_NAME = getEnvVar('SERVICE_NAME', 'ts-microservice');
const VERSION = getEnvVar('VERSION', 'unknown');
const CLOUD_RUN_LOCATION = getEnvVar('CLOUD_RUN_LOCATION', 'unknown');
const LOG_LEVEL = getEnvVar('LOG_LEVEL', 'info');

const SENSITIVE_FIELDS = ['password', 'secret', 'token', 'authorization'];

@injectable()
export class LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: LOG_LEVEL,
      defaultMeta: {service: SERVICE_NAME, environment: ENVIRONMENT},
      transports: this.createTransports(),
    });
  }

  private createTransports(): winston.transport[] {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: ENVIRONMENT === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
        format:
          ENVIRONMENT === 'production'
            ? this.customFormat()
            : this.consoleFormat(),
      }),
    ];

    if (ENVIRONMENT === 'production') {
      if (PROJECT_ID) {
        transports.push(this.createGoogleCloudTransport());
      }
      transports.push(
        this.createDailyRotateFileTransport(
          'logs/app-%DATE%.log',
          LogLevel.INFO
        )
      );
      transports.push(
        this.createDailyRotateFileTransport(
          'logs/error-%DATE%.log',
          LogLevel.ERROR
        )
      );
    }

    return transports;
  }

  private customFormat() {
    return combine(
      timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
      errors({stack: true}),
      json()
    );
  }

  private consoleFormat() {
    return combine(
      colorize(),
      printf(({level, message, timestamp, ...metadata}) => {
        return `${timestamp} [${level}] ${SERVICE_NAME} - ${message} ${Object.entries(
          metadata
        )
          .map(([key, value]) => `[${key}: ${value}]`)
          .join(' ')}`;
      })
    );
  }

  private createGoogleCloudTransport() {
    return new LoggingWinston({
      keyFilename: path.join(__dirname, '../../../default_credentials.json'),
      projectId: PROJECT_ID,
      logName: 'ts-microservice',
      serviceContext: {service: SERVICE_NAME, version: VERSION},
      resource: {
        type: 'cloud_run_revision',
        labels: {
          service_name: SERVICE_NAME,
          revision_name: process.env.K_REVISION || 'unknown',
          location: CLOUD_RUN_LOCATION,
        },
      },
      labels: {environment: ENVIRONMENT},
    });
  }

  private createDailyRotateFileTransport(filename: string, level: string) {
    return new winston.transports.DailyRotateFile({
      filename,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: this.customFormat(),
      level,
    });
  }

  private formatMessage(message: string, context?: LogContext): any {
    const logEntry: {[key: string]: unknown} = {
      message,
      timestamp: new Date().toISOString(),
      requestId: context?.requestId || crypto.randomUUID(),
      ...context,
    };

    if (Object.keys(logEntry).some(key => SENSITIVE_FIELDS.includes(key))) {
      for (const field of SENSITIVE_FIELDS) {
        if (logEntry[field]) {
          logEntry[field] = '[REDACTED]';
        }
      }
    }

    return logEntry;
  }

  private addSourceLocation(error?: Error): any {
    if (!error || !error.stack) return {};

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
