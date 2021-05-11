import {IRole} from "./role.entity";

export interface IUser {
    id: string;
    login: string;
    password: string;
    role: IRole;
}

export interface IUserRequestData {
    login: string;
    password: string;
    roleId: string;
}
