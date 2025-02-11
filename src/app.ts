import { Machine } from './machine';
import { PublishSubscribeService } from './publishSubscribeService';
import { MachineSaleSubscriber, MachineRefillSubscriber, StockWarningSubscriber } from './machine';
import { eventGenerator } from './helpers';
import { IMachineEvent } from './interfaces';


const machines: Machine[] = [new Machine('001'), new Machine('002'), new Machine('003')];
const pubSubService = new PublishSubscribeService();

const saleSubscriber = new MachineSaleSubscriber(machines, pubSubService);
const refillSubscriber = new MachineRefillSubscriber(machines, pubSubService);
const warningSubscriber = new StockWarningSubscriber();

pubSubService.subscribe('sale', saleSubscriber);
pubSubService.subscribe('refill', refillSubscriber);
pubSubService.subscribe('low_stock_warning', warningSubscriber);
pubSubService.subscribe('stock_level_ok', warningSubscriber);

const events: IMachineEvent[] = Array.from({ length: 20 }, () => eventGenerator());
events.forEach(event => pubSubService.publish(event));
