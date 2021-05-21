import {IOrder, IOrderRequestData} from "../entities/order.entity";
import {order} from "../database/order";
import {v4 as uuidv4} from 'uuid';
import {dealer} from "../database/dealer";
import {manager} from "../database/manager";
import {contract} from "../database/contract";
import {IDealer} from "../entities/dealer.entity";
import {IManager} from "../entities/manager.entity";
import {IContract} from "../entities/contract.entity";

interface IOrderHook {
    getOrders: () => Promise<IOrder[]>
    getOrder: (orderId: string) => Promise<IOrder | undefined>
    deleteOrder: (orderId: string) => Promise<void>
    createOrder: (order: IOrderRequestData) => Promise<IOrder | undefined>
}

export const useOrder = (): IOrderHook => {
    const getOrders = async () => {
        // return await transport.get<IOrder[]>('order')
        return order
    }

    const getOrder = async (orderId: string) => {
        // return await transport.get<IOrder>(`order/${orderId}`)

        return order.find((item) => item.id === orderId)
    }

    const deleteOrder = async (orderId: string) => {
        // return await transport.post<any, {}>(`order/delete/${orderId}`, {})
        const orderIndex = order.findIndex((item) => item.id === orderId);

        order.splice(orderIndex, 1)
    }

    const createOrder = async (order1: IOrderRequestData) => {
        // return await transport.post<IOrder, IOrderRequestData>('order', order)
        const id = uuidv4();
        const dealer1 = dealer.find((item) => item.id === order1.dealerId);
        const manager1 = manager.find((item) => item.id === order1.managerId);
        const contract1 = contract.find((item) => item.id === order1.contractId);

        const {dealerId, managerId, contractId, ...data} = order1;

        order.push({
            id: id,
            order_date: new Date().toDateString(),
            order_status: "not_done",
            dealer: dealer1 as IDealer,
            manager: manager1 as IManager,
            contract: contract1 as IContract,
            createdAt: new Date(),
            updatedAt: new Date(), ...data
        })

        return order.find((item) => item.id === id)
    }

    return {getOrders, getOrder, deleteOrder, createOrder}
}
