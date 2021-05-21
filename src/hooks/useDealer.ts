import {IDealer, IDealerRequestData} from "../entities/dealer.entity";
import {transport} from "../services/Transport";
import {dealer} from "../database/dealer";
import { v4 as uuidv4 } from 'uuid';
import {user} from "../database/users";
import {IUser} from "../entities/user.entity";

interface IDealerHook {
    getDealers: () => Promise<IDealer[]>
    getDealer: (dealerId: string) => Promise<IDealer | undefined>
    deleteDealer: (dealerId: string) => Promise<void>
    createDealer: (dealer: IDealerRequestData) => Promise<IDealer | undefined>
}

export const useDealer = (): IDealerHook => {
    const getDealers = async () => {
        // return await transport.get<IDealer[]>('dealer')
        return dealer
    }

    const getDealer = async (dealerId: string) => {
        // return await transport.get<IDealer>(`dealer/${dealerId}`)
        return dealer.find((item) => {
            return item.id === dealerId
        })
    }

    const deleteDealer = async (dealerId: string) => {
        // return await transport.post<any, {}>(`dealer/delete/${dealerId}`, {})
        const dealerIndex = dealer.findIndex((item) => {
            return item.id === dealerId
        })
        console.log(dealerIndex)
        dealer.splice(dealerIndex, 1)
        console.log(dealer)
    }

    const createDealer = async (dealer1: IDealerRequestData) => {
        // return await transport.post<IDealer, IDealerRequestData>('dealer', dealer)
        const id = uuidv4()
        let user1 = user.find((item) => {
            return item.id === dealer1.userId
        })

        if (!user) user1 = user[0]

        const {userId, ...data} = dealer1

        dealer.push({id: id, user: user1 as IUser, ...data})

        return dealer.find((item) => item.id === id)
    }

    return {getDealer, createDealer, deleteDealer, getDealers}
}
