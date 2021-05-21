import {IManager, IManagerRequestData} from "../entities/manager.entity";
import {manager} from "../database/manager";
import { v4 as uuidv4 } from 'uuid';
import {user} from "../database/users";
import {IUser} from "../entities/user.entity";

interface IManagerHook {
    getManagers: () => Promise<IManager[]>
    getManager: (managerId: string) => Promise<IManager | undefined>
    deleteManager: (managerId: string) => Promise<void>
    createManager: (manager: IManagerRequestData) => Promise<IManager | undefined>
}

export const useManager = (): IManagerHook => {
    const getManagers = async () => {
        // return await transport.get<IManager[]>('manager')
        return manager
    }

    const getManager = async (managerId: string) => {
        // return await transport.get<IManager>(`manager/${managerId}`)

        return manager.find((item) => item.id === managerId)
    }

    const deleteManager = async (managerId: string) => {
        // return await transport.post<any, {}>(`manager/delete/${managerId}`, {})

        const managerIndex = manager.findIndex((item) => item.id === managerId);
        manager.splice(managerIndex, 1);
    }

    const createManager = async (manager1: IManagerRequestData) => {
        // return await transport.post<IManager, IManagerRequestData>('manager', manager)

        const id = uuidv4();
        let user1 = user.find((item) => item.id === manager1.userId);

        if (!user1) user1 = user[0]

        const {userId, ...data} = manager1

        manager.push({id: id, user: user1 as IUser, orders: [], ...data})

        return manager.find((item) => item.id === id)
    }

    return {createManager, deleteManager, getManager, getManagers}
}
