import { IMachineEvent } from './interfaces';

export class MachineSaleEvent implements IMachineEvent {
  constructor(private readonly _sold: number, private readonly _machineId: string) {}
  machineId(): string { return this._machineId; }
  getSoldQuantity(): number { return this._sold; }
  type(): string { return 'sale'; }
}

export class MachineRefillEvent implements IMachineEvent {
  constructor(private readonly _refill: number, private readonly _machineId: string) {}
  machineId(): string { return this._machineId; }
  getRefillQuantity(): number { return this._refill; }
  type(): string { return 'refill'; }
}

export class LowStockWarningEvent implements IMachineEvent {
  constructor(private readonly _machineId: string) {}
  machineId(): string { return this._machineId; }
  type(): string { return 'low_stock_warning'; }
}

export class StockLevelOkEvent implements IMachineEvent {
  constructor(private readonly _machineId: string) {}
  machineId(): string { return this._machineId; }
  type(): string { return 'stock_level_ok'; }
}
