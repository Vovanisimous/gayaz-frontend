import {IReceipt} from "./receipt.entity";

export interface IProduct {
    id: string;
    name: string;
    cost_per_kg: number;
    packing_weight: string;
    packing_price: string;
    container: string;
    amount_in_package: number;
    product_group: string;
    receipts: IReceipt[]
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductRequestData {
    name: string;
    cost_per_kg: number;
    packing_weight: string;
    packing_price: string;
    container: string;
    amount_in_package: number;
    product_group: string;
}