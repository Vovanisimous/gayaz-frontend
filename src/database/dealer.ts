import {IDealer} from "../entities/dealer.entity";
import {user} from "./users";

export const dealer: IDealer[] = [
    {
        id: '1',
        name: "nikita",
        town: "Йошкар-Ола",
        address: "Петрова 1",
        phone_number: "89999999999",
        personal_discount: "10%",
        user: user[1],
    }
]