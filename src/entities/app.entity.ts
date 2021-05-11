import {IUser} from "./user.entity";

export interface IAppContext {
    auth: boolean;
    user?: IUser;

    setAuth(value: boolean): void;

    setUser(value: IUser | undefined): void;
}