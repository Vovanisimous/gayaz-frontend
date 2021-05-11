import {IProduct, IProductRequestData} from "../entities/product.entity";
import {transport} from "../services/Transport";

interface IProductHook {
    getProducts: () => Promise<IProduct[]>
    getProduct: (id: string) => Promise<IProduct>
    deleteProduct: (id: string) => Promise<void>
    createProduct: (product: IProductRequestData) => Promise<IProduct>
}

export const useProduct = (): IProductHook => {
    const getProducts = async () => {
        return await transport.get<IProduct[]>('product')
    }

    const getProduct = async (id: string) => {
        return await transport.get<IProduct>(`product/${id}`)
    }

    const deleteProduct = async (id: string) => {
        return await transport.post<any, {}>(`product/delete/${id}`, {})
    }

    const createProduct = async (product: IProductRequestData) => {
        return await transport.post<IProduct, IProductRequestData>('product', product)
    }

    return {createProduct, deleteProduct, getProduct, getProducts}
}