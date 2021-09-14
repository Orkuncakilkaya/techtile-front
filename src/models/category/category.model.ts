import {ProductModel} from '../product/product.model';

export type CategoryModel = {
    _id: string;
    name: string;
    slug: string;
    products: ProductModel[];
}
