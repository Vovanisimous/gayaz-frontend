import {IUser} from "./user.entity";
import {IOrder} from "./order.entity";

export interface IManager {
    id: string;
    name: string;
    phone_number: string;
    position: string;
    user: IUser;
    orders: IOrder[]
}

export interface IManagerRequestData {
    name: string;
    phone_number: string;
    position: string;
    userId: string;
}