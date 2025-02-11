import {
  MachineSaleEvent,
  MachineRefillEvent,
  LowStockWarningEvent,
  StockLevelOkEvent,
} from "../events";
import {
  MachineSaleSubscriber,
  MachineRefillSubscriber,
  StockWarningSubscriber,
} from "../machine";
import { PublishSubscribeService } from "../publishSubscribeService";
import { Machine } from "../machine";

describe("MachineSaleSubscriber", () => {
  let machines: Machine[];
  let pubSubService: PublishSubscribeService;
  let saleSubscriber: MachineSaleSubscriber;

  beforeEach(() => {
    machines = [new Machine("001"), new Machine("002"), new Machine("003")];
    pubSubService = new PublishSubscribeService();
    saleSubscriber = new MachineSaleSubscriber(machines, pubSubService);
  });

  test("should decrease stock and send low stock warning if stock is less than 3", () => {
    const machineId = "001";
    const initialStock = 10;
    const saleQuantity = 9;

    machines.find((m) => m.id === machineId)!.stockLevel = initialStock;

    const event = new MachineSaleEvent(saleQuantity, machineId);
    saleSubscriber.handle(event);

    const machine = machines.find((m) => m.id === machineId);
    expect(machine?.stockLevel).toBe(1);
    expect(machine?.lowStockWarningSent).toBe(true);
  });
});

describe("MachineRefillSubscriber", () => {
  let machines: Machine[];
  let pubSubService: PublishSubscribeService;
  let refillSubscriber: MachineRefillSubscriber;

  beforeEach(() => {
    machines = [new Machine("001"), new Machine("002"), new Machine("003")];
    pubSubService = new PublishSubscribeService();
    refillSubscriber = new MachineRefillSubscriber(machines, pubSubService);
  });

  test("should refill stock and reset low stock warning if stock is enough", () => {
    const machineId = "001";
    const initialStock = 1;
    const refillQuantity = 5;

    machines.find((m) => m.id === machineId)!.stockLevel = initialStock;

    const event = new MachineRefillEvent(refillQuantity, machineId);
    refillSubscriber.handle(event);

    const machine = machines.find((m) => m.id === machineId);
    expect(machine?.stockLevel).toBe(6);
    expect(machine?.lowStockWarningSent).toBe(false);
  });
});

describe("PublishSubscribeService", () => {
  let pubSubService: PublishSubscribeService;
  let warningSubscriber: StockWarningSubscriber;

  beforeEach(() => {
    pubSubService = new PublishSubscribeService();
    warningSubscriber = new StockWarningSubscriber();
    pubSubService.subscribe("low_stock_warning", warningSubscriber);
    pubSubService.subscribe("stock_level_ok", warningSubscriber);
  });

  test("should trigger stock warning event", () => {
    const machineId = "001";
    const event = new LowStockWarningEvent(machineId);

    const spy = jest.spyOn(console, "log");
    pubSubService.publish(event);
    expect(spy).toHaveBeenCalledWith(
      `Machine ${machineId} - Event: low_stock_warning`
    );
  });

  test("should trigger stock level ok event", () => {
    const machineId = "001";
    const event = new StockLevelOkEvent(machineId);

    const spy = jest.spyOn(console, "log");
    pubSubService.publish(event);
    expect(spy).toHaveBeenCalledWith(
      `Machine ${machineId} - Event: stock_level_ok`
    );
  });
});
