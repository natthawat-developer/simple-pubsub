// Using IMachineEvent instead of IEvent because IEvent conflicts with the DOM Event interface.
export interface IMachineEvent {
  type(): string;
  machineId(): string;
}

// Your program should now allow you to create ISubscriber objects, register them using your IPublishSubscribService implementation. 
// You can then create IEvent objects and call your IPublishSubscribService's implementations .publish() method. 
// All handlers subscribed should have their 'handle' methods invoked.

// Note I: Handlers can also create new events, if desired. 
// The events would get handled after all existing events are handled.
export interface ISubscriber {
  handle(event: IMachineEvent): void;
}

export interface IPublishSubscribeService {
  publish(event: IMachineEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  unsubscribe(type: string, handler: ISubscriber): void;
}
