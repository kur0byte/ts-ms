// export interface LoggerConfig {
//   level: string;
//   format: 'json' | 'pretty';
//   google?: {
//     projectId: string;
//     keyFilename?: string;
//     logName: string;
//   };
//   rotation: {
//     maxSize: string;
//     maxFiles: string;
//   };
//   paths: {
//     app: string;
//     error: string;
//   };
// }

import {injectable} from 'inversify';

export const loggerConfig: Record<string, LoggerConfig> = {
  development: {
    level: 'debug',
    format: 'pretty',
    rotation: {
      maxSize: '10m',
      maxFiles: '7d',
    },
    paths: {
      app: 'logs/development/app-%DATE%.log',
      error: 'logs/development/error-%DATE%.log',
    },
  },
  test: {
    level: 'error',
    format: 'json',
    rotation: {
      maxSize: '10m',
      maxFiles: '7d',
    },
    paths: {
      app: 'logs/test/app-%DATE%.log',
      error: 'logs/test/error-%DATE%.log',
    },
  },
  production: {
    level: 'info',
    format: 'json',
    google: {
      projectId: process.env._CLOUD_PROJECT!,
      logName: 'ts-microservice',
    },
    rotation: {
      maxSize: '20m',
      maxFiles: '14d',
    },
    paths: {
      app: '/var/log/app-%DATE%.log',
      error: '/var/log/error-%DATE%.log',
    },
  },
};

export const getLoggerConfig = (): LoggerConfig => {
  const environment = process.env.NODE_ENV || 'development';
  return loggerConfig[environment];
};

@injectable()
export class LoggerConfig {
  public readonly level: string = 'info';
  public readonly format: 'json' | 'pretty' = 'json';
  public readonly google?: {
    projectId: string;
    keyFilename?: string;
    logName: string;
  };
  public readonly rotation: {
    maxSize: string;
    maxFiles: string;
  } = {
    maxSize: '10m',
    maxFiles: '7d',
  };
  public readonly paths: {
    app: string;
    error: string;
  } = {
    app: 'logs/app-%DATE%.log',
    error: 'logs/error-%DATE%.log',
  };

  constructor() {
    const config = getLoggerConfig();
    this.level = config.level;
    this.format = config.format;
    this.google = config.google;
    this.rotation = config.rotation;
    this.paths = config.paths;
  }
}
