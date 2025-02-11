import {
  MachineSaleSubscriber,
  MachineRefillSubscriber,
  StockWarningSubscriber,
} from "../machine";
import {
  MachineSaleEvent,
  MachineRefillEvent,
  LowStockWarningEvent,
  StockLevelOkEvent,
} from "../events";
import { PublishSubscribeService } from "../publishSubscribeService";
import { Machine } from "../machine";

jest.mock("../publishSubscribeService", () => ({
  PublishSubscribeService: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  })),
}));

describe("Machine Subscribers", () => {
  let pubSubService: PublishSubscribeService;
  let machines: Machine[];

  beforeEach(() => {
    jest.clearAllMocks();
    pubSubService = new PublishSubscribeService();
    machines = [new Machine("1234"), new Machine("5678")];
  });

  test("MachineSaleSubscriber should reduce stock and trigger low stock warning when stock is low", () => {
    const subscriber = new MachineSaleSubscriber(machines, pubSubService);
    const saleEvent = new MachineSaleEvent(8, "1234");

    subscriber.handle(saleEvent);

    expect(machines[0].stockLevel).toBe(2);

    expect(machines[0].lowStockWarningSent).toBe(true);

    expect(pubSubService.publish).toHaveBeenCalledWith(
      new LowStockWarningEvent("1234")
    );
  });

  test("MachineRefillSubscriber should increase stock and trigger stock level ok event when stock is enough", () => {
    const subscriber = new MachineRefillSubscriber(machines, pubSubService);

    machines[0].stockLevel = 2;
    machines[0].lowStockWarningSent = true;

    const refillEvent = new MachineRefillEvent(5, "1234");

    subscriber.handle(refillEvent);

    expect(machines[0].stockLevel).toBe(7);
    expect(machines[0].lowStockWarningSent).toBe(false);

    expect(pubSubService.publish).toHaveBeenCalledTimes(1);

    expect(pubSubService.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        _machineId: "1234",
      })
    );
  });

  test("StockWarningSubscriber should handle low stock and stock level ok events", () => {
    const stockWarningSubscriber = new StockWarningSubscriber();

    const lowStockEvent = new LowStockWarningEvent("1234");
    const stockLevelOkEvent = new StockLevelOkEvent("1234");

    console.log = jest.fn();

    stockWarningSubscriber.handle(lowStockEvent);
    expect(console.log).toHaveBeenCalledWith(
      "Machine 1234 - Event: low_stock_warning"
    );

    stockWarningSubscriber.handle(stockLevelOkEvent);
    expect(console.log).toHaveBeenCalledWith(
      "Machine 1234 - Event: stock_level_ok"
    );
  });
});
