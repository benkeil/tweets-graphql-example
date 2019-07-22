import { ContainerInstance, Service } from 'typedi';

@Service()
export class Context {

  public requestId: string;

  public container: ContainerInstance;
}
