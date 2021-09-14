import React, {useContext, useMemo} from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import UserContext from '../../../context/user.context';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import {NextPageContext} from 'next';
import {ProductModel} from '../../../models/product/product.model';
import ImageGallery from 'react-image-gallery';
import {UserModel} from '../../../models/user/user.model';
import {CategoryModel} from '../../../models/category/category.model';

interface Props {
    product: ProductModel;
    user: UserModel;
    categories: CategoryModel[];
}

const fetchProduct = async (productId: string) => {
    return await fetch(`http://localhost:5567/product/${productId}`).then(async (res) => ({
        status: res.status,
        body: await res.json(),
    }));
};

const ProductDetailPage = (props: Props) => {
    const {product, user, categories} = props;
    const Alert = withReactContent(Swal);
    const {token} = useContext(UserContext);

    const images = useMemo(() => {
        return [
            {
                original: `http://localhost:5567/${product.mainImageUrl}`,
            },
            ...product.extraImages.map(image => ({original: `http://localhost:5567/${image}`})),
        ];
    }, [product]);

    const deleteProduct = async (id: string) => {
        const {status} = await fetch(`http://localhost:5567/product/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            method: 'DELETE',
        }).then(res => ({status: res.status}));
        if (status === 200) {
            await Alert.fire({
                title: 'Product Deleted',
                icon: 'success',
            });
            window.location.href = '/';
        } else {
            await Alert.fire({
                title: 'Error',
                text: 'Product couldn\'t deleted',
                icon: 'error',
            });
        }
    };

    return (
        <Card>
            <Card.Header>
                <Card.Title>{product.name}</Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="row mx-0">
                    <div className="col-12 col-md-6">
                        <ImageGallery
                            items={images}
                            lazyLoad={true}
                            autoPlay={false}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            showBullets={true}/>
                    </div>
                    <div className="col-12 col-md-6">
                        {product.description}
                        <table className="table table-hover">
                            <tbody>
                            <tr>
                                <th>Client</th>
                                <td>{user.fullName}</td>
                            </tr>
                            <tr>
                                <th>Category</th>
                                <td>{categories.map(category => category.name).join(', ')}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer>
                <div className="btn-group">
                    <button type="button" className="btn btn-danger"
                            onClick={() => deleteProduct(product._id)}>
                        Delete
                    </button>
                    <a href={`/product/update/${product._id}`} className="btn btn-warning">Update</a>
                </div>
            </Card.Footer>
        </Card>
    );
};

ProductDetailPage.getInitialProps = async (ctx: NextPageContext) => {
    const {body: productBody} = await fetchProduct(ctx.query.id as string);

    return {product: productBody.data.product, categories: productBody.data.categories, user: productBody.data.user};
};

export default ProductDetailPage;
