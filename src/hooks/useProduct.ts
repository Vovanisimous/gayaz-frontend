import {IProduct, IProductRequestData} from "../entities/product.entity";
import {transport} from "../services/Transport";
import {v4 as uuidv4} from 'uuid';
import {product} from "../database/product";

interface IProductHook {
    getProducts: () => Promise<IProduct[]>
    getProduct: (id: string) => Promise<IProduct | undefined>
    deleteProduct: (id: string) => Promise<void>
    createProduct: (product: IProductRequestData) => Promise<IProduct | undefined>
}

export const useProduct = (): IProductHook => {
    const getProducts = async () => {
        // return await transport.get<IProduct[]>('product')
        return product
    }

    const getProduct = async (id: string) => {
        // return await transport.get<IProduct>(`product/${id}`)

        return product.find((item) => item.id === id)
    }

    const deleteProduct = async (id: string) => {
        // return await transport.post<any, {}>(`product/delete/${id}`, {})

        const productIndex = product.findIndex((item) => item.id === id);
        product.splice(productIndex, 1)
    }

    const createProduct = async (product1: IProductRequestData) => {
        // return await transport.post<IProduct, IProductRequestData>('product', product)
        const id = uuidv4()

        product.push({id: id, receipts: [], createdAt: new Date(), updatedAt: new Date (), ...product1})

        return product.find((item) => item.id === id)
    }

    return {createProduct, deleteProduct, getProduct, getProducts}
}
