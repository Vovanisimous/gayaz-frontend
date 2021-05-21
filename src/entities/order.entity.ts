import {IDealer} from "./dealer.entity";
import {IManager} from "./manager.entity";
import {IContract} from "./contract.entity";
import {IReceipt} from "./receipt.entity";

export interface IOrder {
    id: string;
    order_date: string;
    order_status: string;
    dealer: IDealer;
    manager: IManager;
    contract: IContract;
    receipts: (IReceipt | undefined)[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderRequestData {
    dealerId: string;
    managerId: string;
    contractId: string;
    receipts: (IReceipt | undefined)[];
}
