import {IOrder, IOrderRequestData} from "../entities/order.entity";
import {transport} from "../services/Transport";

interface IOrderHook {
    getOrders: () => Promise<IOrder[]>
    getOrder: (orderId: string) => Promise<IOrder>
    deleteOrder: (orderId: string) => Promise<void>
    createOrder: (order: IOrderRequestData) => Promise<IOrder>
}

export const useOrder = (): IOrderHook => {
    const getOrders = async () => {
        return await transport.get<IOrder[]>('order')
    }

    const getOrder = async (orderId: string) => {
        return await transport.get<IOrder>(`order/${orderId}`)
    }

    const deleteOrder = async (orderId: string) => {
        return await transport.post<any, {}>(`order/delete/${orderId}`, {})
    }

    const createOrder = async (order: IOrderRequestData) => {
        return await transport.post<IOrder, IOrderRequestData>('order', order)
    }

    return {getOrders, getOrder, deleteOrder, createOrder}
}