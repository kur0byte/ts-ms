import {injectable} from 'inversify';
import {HTTPApplication} from './HTTPBaseServer.abstract';

@injectable()
export class Server extends HTTPApplication {}
