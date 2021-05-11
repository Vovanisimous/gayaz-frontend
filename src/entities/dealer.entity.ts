import {IUser} from "./user.entity";

export interface IDealer {
    id: string
    name: string;
    town: string;
    address: string;
    phone_number: string;
    personal_discount: string;
    user: IUser;
}

export interface IDealerRequestData {
    name: string;
    town: string;
    address: string;
    phone_number: string;
    personal_discount: string;
    userId: string;
}