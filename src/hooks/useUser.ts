import {IUser, IUserRequestData} from "../entities/user.entity";
import {transport} from "../services/Transport";
import {v4 as uuidv4} from 'uuid';
import {user} from "../database/users";
import {role} from "../database/role";
import {IRole} from "../entities/role.entity";

interface IUserHook {
    getUsers: () => Promise<IUser[]>
    getUser: (userId: string) => Promise<IUser| undefined>
    deleteUser: (userId: string) => Promise<void>
    createUser: (user: IUserRequestData) => Promise<IUser | undefined>
}

export const useUser = (): IUserHook => {
    const getUsers = async () => {
        // return await transport.get<IUser[]>('user')
        return user
    }

    const getUser = async (userId: string) => {
        // return await transport.get<IUser>(`user/${userId}`)
        return user.find((item) => item.id === userId)
    }

    const deleteUser = async (userId: string) => {
        // return await transport.post<any, {}>(`user/delete/${userId}`, {})

        const userIndex = user.findIndex((item) => item.id === userId);
        user.splice(userIndex, 1)
    }

    const createUser = async (user1: IUserRequestData) => {
        // return await transport.post<IUser, IUserRequestData>('user', user)

        const id = uuidv4();
        const role1 = role.find((item) => item.id === user1.roleId)

        const {roleId, ...data} = user1;

        user.push({id: id, role: role1 as IRole, ...data})

        return user.find((item) => item.id === id)
    }

    return {getUser, createUser, deleteUser, getUsers}
}
