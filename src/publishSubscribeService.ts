import {
  IMachineEvent,
  ISubscriber,
  IPublishSubscribeService,
} from "./interfaces";

// 1. Build the Publish-Subscribe mechanism. 
// Allow ISubscriber objects to register against an concrete IPublishSubscribeService object for an event type. 
// Implement the publish method so that when a publish event occurs, all subscribers of that the event type published will have a chance to handle the event. 
// The subscribers should be working off a shared array of Machine objects, mutating them depending on the event received.
export class PublishSubscribeService implements IPublishSubscribeService {
  private subscribers: Map<string, Set<ISubscriber>> = new Map();

  publish(event: IMachineEvent): void {
    console.log(
      `Publishing event: ${event.type()} for Machine ${event.machineId()}`
    );
    const handlers = this.subscribers.get(event.type());
    if (handlers) {
      handlers.forEach((handler) => handler.handle(event));
    }
  }

  subscribe(type: string, handler: ISubscriber): void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)!.add(handler);
  }
  
// 2. Now add the method 'unsubscribe' on IPublishSubscribeService to allow handlers to unsubscribe from events. 
// You may change the existing method signatures.
  unsubscribe(type: string, handler: ISubscriber): void {
    this.subscribers.get(type)?.delete(handler);
  }
}
