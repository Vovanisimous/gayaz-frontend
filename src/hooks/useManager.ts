import {IManager, IManagerRequestData} from "../entities/manager.entity";
import {transport} from "../services/Transport";

interface IManagerHook {
    getManagers: () => Promise<IManager[]>
    getManager: (managerId: string) => Promise<IManager>
    deleteManager: (managerId: string) => Promise<void>
    createManager: (manager: IManagerRequestData) => Promise<IManager>
}

export const useManager = (): IManagerHook => {
    const getManagers = async () => {
        return await transport.get<IManager[]>('manager')
    }

    const getManager = async (managerId: string) => {
        return await transport.get<IManager>(`manager/${managerId}`)
    }

    const deleteManager = async (managerId: string) => {
        return await transport.post<any, {}>(`manager/delete/${managerId}`, {})
    }

    const createManager = async (manager: IManagerRequestData) => {
        return await transport.post<IManager, IManagerRequestData>('manager', manager)
    }

    return {createManager, deleteManager, getManager, getManagers}
}