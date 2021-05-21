import {IOrder} from "./order.entity";
import {IProduct} from "./product.entity";

export interface IReceipt {
    id: string;
    amount: number;
    order: IOrder | undefined;
    product: IProduct;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReceiptRequestData {
    amount: number;
    productId: string;
}