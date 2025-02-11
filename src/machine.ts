import { ISubscriber } from "./interfaces";
import {
  MachineSaleEvent,
  MachineRefillEvent,
  LowStockWarningEvent,
  StockLevelOkEvent,
} from "./events";
import { IPublishSubscribeService } from "./interfaces";

export class Machine {
  public stockLevel: number = 10;
  public id: string;
  public lowStockWarningSent: boolean = false;
  constructor(id: string) {
    this.id = id;
  }
}

export class MachineSaleSubscriber implements ISubscriber {
  constructor(
    private machines: Machine[],
    private pubSubService: IPublishSubscribeService
  ) {}

  handle(event: MachineSaleEvent): void {
    const machine = this.machines.find((m) => m.id === event.machineId());
    if (machine) {
      machine.stockLevel -= event.getSoldQuantity();
      console.log(
        `Machine ${
          machine.id
        } sold ${event.getSoldQuantity()} units, stock left: ${
          machine.stockLevel
        }`
      );
      if (machine.stockLevel < 3 && !machine.lowStockWarningSent) {
        machine.lowStockWarningSent = true;
        this.pubSubService.publish(new LowStockWarningEvent(machine.id));
      }
    }
  }
}

export class MachineRefillSubscriber implements ISubscriber {
  constructor(
    private machines: Machine[],
    private pubSubService: IPublishSubscribeService
  ) {}

  handle(event: MachineRefillEvent): void {
    const machine = this.machines.find((m) => m.id === event.machineId());
    if (machine) {
      machine.stockLevel += event.getRefillQuantity();
      console.log(
        `Machine ${
          machine.id
        } refilled with ${event.getRefillQuantity()} units, new stock: ${
          machine.stockLevel
        }`
      );

      if (machine.stockLevel >= 3 && machine.lowStockWarningSent) {
        machine.lowStockWarningSent = false;
        this.pubSubService.publish(new StockLevelOkEvent(machine.id));
      }
    }
  }
}

export class StockWarningSubscriber implements ISubscriber {
  handle(event: LowStockWarningEvent | StockLevelOkEvent): void {
    console.log(`Machine ${event.machineId()} - Event: ${event.type()}`);
  }
}
