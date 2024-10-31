export interface LoggerConfig {
  level: string;
  format: 'json' | 'pretty';
  rotation: {
    maxSize: string;
    maxFiles: string;
  };
  paths: {
    app: string;
    error: string;
    exceptions: string;
  };
}

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
      exceptions: 'logs/development/exceptions-%DATE%.log',
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
      exceptions: 'logs/test/exceptions-%DATE%.log',
    },
  },
  production: {
    level: 'info',
    format: 'json',
    rotation: {
      maxSize: '20m',
      maxFiles: '14d',
    },
    paths: {
      app: '/var/log/app-%DATE%.log',
      error: '/var/log/error-%DATE%.log',
      exceptions: '/var/log/exceptions-%DATE%.log',
    },
  },
};

export const getLoggerConfig = (): LoggerConfig => {
  const environment = process.env.NODE_ENV || 'development';
  return loggerConfig[environment];
};
