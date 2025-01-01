import { Product } from "./product.models";

export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}