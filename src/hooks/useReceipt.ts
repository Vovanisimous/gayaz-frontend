import {IReceipt, IReceiptRequestData} from "../entities/receipt.entity";
import {transport} from "../services/Transport";
import {receipt} from "../database/receipt";
import {v4 as uuidv4} from 'uuid';
import {product} from "../database/product";
import {IProduct} from "../entities/product.entity";

interface IReceiptHook {
    getReceipts: () => Promise<IReceipt[]>
    getReceipt: (receiptId: string) => Promise<IReceipt | undefined>
    deleteReceipt: (receiptId: string) => Promise<void>
    createReceipt: (receipt: IReceiptRequestData[]) => Promise<(IReceipt | undefined)[]>
}

export const useReceipt = (): IReceiptHook => {
    const getReceipts = async () => {
        // return await transport.get<IReceipt[]>('receipt')
        return receipt
    }

    const getReceipt = async (receiptId: string) => {
        // return await transport.get<IReceipt>(`receipt/${receiptId}`)
        return receipt.find((item) => item.id === receiptId)
    }

    const deleteReceipt = async (receiptId: string) => {
        // return await transport.post<any, {}>(`receipt/delete/${receiptId}`, {})
        const receiptIndex = receipt.findIndex((item) => item.id === receiptId);
        receipt.splice(receiptIndex, 1)
    }

    const createReceipt = async (receipt1: IReceiptRequestData[]) => {
        // return await transport.post<IReceipt[], IReceiptRequestData[]>('receipt', receipt)
       return receipt1.map((receipt11) => {
           const id = uuidv4()
           const product1 = product.find((item) => item.id === receipt11.productId)

           const {productId, ...data} = receipt11

           receipt.push({id: id, order: undefined, product: product1 as IProduct, updatedAt: new Date(), createdAt: new Date(), ...data})

           return receipt.find((item) => item.id === id)
       })

    }

    return {createReceipt, deleteReceipt, getReceipt, getReceipts}
}