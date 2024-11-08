import {injectable} from 'inversify';

@injectable()
export class GcpConfig {
  public readonly projectId: string = 'my-project-id';
  public readonly credentials: string = 'my-credentials';
}
