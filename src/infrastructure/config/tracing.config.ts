// import { injectable } from "inversify";

import {injectable} from 'inversify';

// @injectable()
// export class TracingConfig {
//   constructor(
//       public readonly serviceName: string,
//       public readonly serviceVersion: string,
//       public readonly environment: string,
//       public readonly projectId: string,
//       public readonly credentials: string,
//       public readonly useDefaultCredentials: boolean,
//       public readonly samplingRatio: number
//   ) {}

//   public static create(env: NodeJS.ProcessEnv): TracingConfig {
//       return new TracingConfig(
//           env.SERVICE_NAME || 'unknown-service',
//           env.SERVICE_VERSION || '0.0.0',
//           env.NODE_ENV || 'development',
//           env.GOOGLE_CLOUD_PROJECT || '',
//           env.GOOGLE_APPLICATION_CREDENTIALS || '',
//           env.USE_DEFAULT_CREDENTIALS === 'true',
//           parseFloat(env.TRACE_SAMPLING_RATIO || '1.0')
//       );
//   }
// }

// @injectable()
// export class TracingConfig {
//   public readonly serviceName: string = 'my-service';
//   public readonly serviceVersion: string = '1.0.0';
//   public readonly environment: string = 'production';
//   public readonly projectId: string = 'my-project-id';
//   public readonly credentials: string = 'my-credentials';
//   public readonly useDefaultCredentials: boolean = true;
//   public readonly samplingRatio: number = 1.0;
// }
