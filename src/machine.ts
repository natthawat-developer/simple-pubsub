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

// 4. Let's add some new behaviour. If a machine stock levels drops below 3 a new Event, LowStockWarningEvent should be generated. 
// When the stock levels hits 3 or above (because of a MachineRefillEvent), a StockLevelOkEvent should be generated.  
// For each machine, LowStockWarningEvent or StockLevelOkEvent should only fire one time when crossing the threshold of 3. 
// You may want to introduce new subscribers (e.g. a new subscriber called StockWarningSubscriber). 
// In fact you may change anything as long as the task is performed and you can justify your reasonings. 
// Remember subscribers should be notified in the order that the events occured.

//Note II: If a subscriber subscribes after an event has already been published and consumed, they will not receive that event.
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
// 3. Implement MachineRefillSubscriber. It will increase the stock quantity of the machine.
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
