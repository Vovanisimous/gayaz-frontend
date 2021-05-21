import {IManager} from "../entities/manager.entity";
import {IOrder} from "../entities/order.entity";
import {user} from "./users";

export const manager: IManager[] = [
    {
        id: "45fd9094-f46b-453b-95d4-6aa35ff66776",
        name: "Иван Ива нов",
        phone_number: "8 999 9999999",
        position: "Менеджер",
        user: user[2],
        orders: []
    }
]
