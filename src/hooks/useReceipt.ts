import {IReceipt, IReceiptRequestData} from "../entities/receipt.entity";
import {transport} from "../services/Transport";

interface IReceiptHook {
    getReceipts: () => Promise<IReceipt[]>
    getReceipt: (receiptId: string) => Promise<IReceipt>
    deleteReceipt: (receiptId: string) => Promise<void>
    createReceipt: (receipt: IReceiptRequestData[]) => Promise<IReceipt[]>
}

export const useReceipt = (): IReceiptHook => {
    const getReceipts = async () => {
        return await transport.get<IReceipt[]>('receipt')
    }

    const getReceipt = async (receiptId: string) => {
        return await transport.get<IReceipt>(`receipt/${receiptId}`)
    }

    const deleteReceipt = async (receiptId: string) => {
        return await transport.post<any, {}>(`receipt/delete/${receiptId}`, {})
    }

    const createReceipt = async (receipt: IReceiptRequestData[]) => {
        return await transport.post<IReceipt[], IReceiptRequestData[]>('receipt', receipt)
    }

    return {createReceipt, deleteReceipt, getReceipt, getReceipts}
}