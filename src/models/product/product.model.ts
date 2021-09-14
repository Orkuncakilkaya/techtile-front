import {CategoryModel} from '../category/category.model';
import {UserModel} from '../user/user.model';

export type ProductModel = {
    _id: string;
    slug: string;
    name: string;
    description: string;
    mainImageUrl: string;
    extraImages: string[];
    created_at: string;
    categoryIdList: string[];
    categories: CategoryModel[];
    user: UserModel;
}
