import {IUser} from "../entities/user.entity";
import {role} from "./role";

export const user: IUser[] = [
    {
        id: "1",
        login: "vova",
        password: "12345",
        role: role[0],
    },
    {
        id: "2",
        login: "nikita",
        password: "12345",
        role: role[1]
    },
    {
        id: "3",
        login: "daniil",
        password: "12345",
        role: role[2]
    }
]
