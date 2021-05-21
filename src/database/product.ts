import {IProduct} from "../entities/product.entity";
import {receipt} from "./receipt";
import {IReceipt} from "../entities/receipt.entity";

export const product: IProduct[] = [
    {
        id: "1",
        name: "Макароны",
        cost_per_kg: 12,
        packing_weight: "300 кг.",
        packing_price: "200 руб.",
        container: "Большой",
        amount_in_package: 23,
        product_group: "Еда",
        receipts: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "2",
        name: "Помидоры",
        cost_per_kg: 30,
        packing_weight: "12 кг.",
        packing_price: "15 руб.",
        container: "Большой",
        amount_in_package: 12,
        product_group: "Еда",
        receipts: [],
        createdAt: new Date(),
        updatedAt: new Date()
    }
]
