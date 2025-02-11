import { IMachineEvent, ISubscriber, IPublishSubscribeService } from './interfaces';

export class PublishSubscribeService implements IPublishSubscribeService {
  private subscribers: Map<string, Set<ISubscriber>> = new Map();

  publish(event: IMachineEvent): void {
      console.log(`Publishing event: ${event.type()} for Machine ${event.machineId()}`);
      const handlers = this.subscribers.get(event.type());
      if (handlers) {
          handlers.forEach(handler => handler.handle(event));
      }
  }

  subscribe(type: string, handler: ISubscriber): void {
      if (!this.subscribers.has(type)) {
          this.subscribers.set(type, new Set());
      }
      this.subscribers.get(type)!.add(handler);
  }

  unsubscribe(type: string, handler: ISubscriber): void {
      this.subscribers.get(type)?.delete(handler);
  }
}
