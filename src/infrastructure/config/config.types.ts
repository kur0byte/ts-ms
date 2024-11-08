import {globalConfig} from './global.config';
import {GcpConfig} from './gcp.config';
import {ObservabilityConfig} from './observability.config';
import {DatabaseConfig} from './database.config';
import {LoggerConfig} from './logger.config';
import {HttpConfig} from './http.config';

export type ConfigTypes = {
  GlobalConfig: globalConfig;
  DatabaseConfig: DatabaseConfig;
  LoggerConfig: LoggerConfig;
  // server: ServerConfig,
  ObservabilityConfig: ObservabilityConfig;
  HttpConfig: HttpConfig;
  GcpConfig: GcpConfig;
};
