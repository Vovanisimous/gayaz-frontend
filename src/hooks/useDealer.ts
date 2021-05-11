import {IDealer, IDealerRequestData} from "../entities/dealer.entity";
import {transport} from "../services/Transport";

interface IDealerHook {
    getDealers: () => Promise<IDealer[]>
    getDealer: (dealerId: string) => Promise<IDealer>
    deleteDealer: (dealerId: string) => Promise<void>
    createDealer: (dealer: IDealerRequestData) => Promise<IDealer>
}

export const useDealer = (): IDealerHook => {
    const getDealers = async () => {
        return await transport.get<IDealer[]>('dealer')
    }

    const getDealer = async (dealerId: string) => {
        return await transport.get<IDealer>(`dealer/${dealerId}`)
    }

    const deleteDealer = async (dealerId: string) => {
        return await transport.post<any, {}>(`dealer/delete/${dealerId}`, {})
    }

    const createDealer = async (dealer: IDealerRequestData) => {
        return await transport.post<IDealer, IDealerRequestData>('dealer', dealer)
    }

    return {getDealer, createDealer, deleteDealer, getDealers}
}