import { MachineSaleEvent, MachineRefillEvent, LowStockWarningEvent, StockLevelOkEvent } from "../events";

describe("MachineSaleEvent", () => {
  test("should return correct machineId and sold quantity", () => {
    const event = new MachineSaleEvent(10, "machine123");

    expect(event.machineId()).toBe("machine123");
    expect(event.getSoldQuantity()).toBe(10);
    expect(event.type()).toBe("sale");
  });
});

describe("MachineRefillEvent", () => {
  test("should return correct machineId and refill quantity", () => {
    const event = new MachineRefillEvent(5, "machine456");

    expect(event.machineId()).toBe("machine456");
    expect(event.getRefillQuantity()).toBe(5);
    expect(event.type()).toBe("refill");
  });
});

describe("LowStockWarningEvent", () => {
  test("should return correct machineId", () => {
    const event = new LowStockWarningEvent("machine789");

    expect(event.machineId()).toBe("machine789");
    expect(event.type()).toBe("low_stock_warning");
  });
});

describe("StockLevelOkEvent", () => {
  test("should return correct machineId", () => {
    const event = new StockLevelOkEvent("machine101");

    expect(event.machineId()).toBe("machine101");
    expect(event.type()).toBe("stock_level_ok");
  });
});
