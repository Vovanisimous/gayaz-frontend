import {IUser, IUserRequestData} from "../entities/user.entity";
import {transport} from "../services/Transport";

interface IUserHook {
    getUsers: () => Promise<IUser[]>
    getUser: (userId: string) => Promise<IUser>
    deleteUser: (userId: string) => Promise<void>
    createUser: (user: IUserRequestData) => Promise<IUser>
}

export const useUser = (): IUserHook => {
    const getUsers = async () => {
        return await transport.get<IUser[]>('user')
    }

    const getUser = async (userId: string) => {
        return await transport.get<IUser>(`user/${userId}`)
    }

    const deleteUser = async (userId: string) => {
        return await transport.post<any, {}>(`user/delete/${userId}`, {})
    }

    const createUser = async (user: IUserRequestData) => {
        return await transport.post<IUser, IUserRequestData>('user', user)
    }

    return {getUser, createUser, deleteUser, getUsers}
}