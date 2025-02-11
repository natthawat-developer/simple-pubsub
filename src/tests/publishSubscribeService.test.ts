import { PublishSubscribeService } from "../publishSubscribeService";
import { IMachineEvent, ISubscriber } from "../interfaces";

class MockSubscriber implements ISubscriber {
  handle = jest.fn();
}

describe("PublishSubscribeService", () => {
  let publishSubscribeService: PublishSubscribeService;
  let mockSubscriber: MockSubscriber;

  beforeEach(() => {
    publishSubscribeService = new PublishSubscribeService();
    mockSubscriber = new MockSubscriber();
  });

  test("should subscribe to an event", () => {
    const eventType = "MACHINE_SOLD";
    publishSubscribeService.subscribe(eventType, mockSubscriber);

    const subscribers = publishSubscribeService["subscribers"].get(eventType);
    expect(subscribers?.size).toBe(1);
    expect(subscribers?.has(mockSubscriber)).toBe(true);
  });

  test("should publish an event to subscribers", () => {
    const eventType = "MACHINE_SOLD";
    const event: IMachineEvent = {
      type: () => eventType,
      machineId: () => "1234",
    };

    publishSubscribeService.subscribe(eventType, mockSubscriber);

    publishSubscribeService.publish(event);

    expect(mockSubscriber.handle).toHaveBeenCalledWith(event);
  });

  test("should not call handle if no subscribers are present", () => {
    const eventType = "MACHINE_SOLD";
    const event: IMachineEvent = {
      type: () => eventType,
      machineId: () => "1234",
    };

    publishSubscribeService.publish(event);

    expect(mockSubscriber.handle).not.toHaveBeenCalled();
  });

  test("should unsubscribe from an event", () => {
    const eventType = "MACHINE_SOLD";
    publishSubscribeService.subscribe(eventType, mockSubscriber);

    publishSubscribeService.unsubscribe(eventType, mockSubscriber);

    const subscribers = publishSubscribeService["subscribers"].get(eventType);
    expect(subscribers?.size).toBe(0);
    expect(subscribers?.has(mockSubscriber)).toBe(false);
  });

  test("should not call handle after unsubscribe", () => {
    const eventType = "MACHINE_SOLD";
    const event: IMachineEvent = {
      type: () => eventType,
      machineId: () => "1234",
    };

    publishSubscribeService.subscribe(eventType, mockSubscriber);
    publishSubscribeService.unsubscribe(eventType, mockSubscriber);

    publishSubscribeService.publish(event);

    expect(mockSubscriber.handle).not.toHaveBeenCalled();
  });
});
