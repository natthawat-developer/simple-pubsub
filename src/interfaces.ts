export interface IMachineEvent {
  type(): string;
  machineId(): string;
}

export interface ISubscriber {
  handle(event: IMachineEvent): void;
}

export interface IPublishSubscribeService {
  publish(event: IMachineEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  unsubscribe(type: string, handler: ISubscriber): void;
}
