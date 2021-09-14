import React, {useCallback, useContext, useMemo, useState} from 'react';
import {Button, Card, Form} from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import {CategoryModel} from '../../../models/category/category.model';
import {ProductModel} from '../../../models/product/product.model';
import UserContext from '../../../context/user.context';
import {NextPageContext} from 'next';

interface Props {
    categories: CategoryModel[];
    product: ProductModel;
}

const fetchCategories = async () => {
    return await fetch('http://165.22.88.161:5567/category').then(async (res) => ({
        status: res.status,
        body: await res.json(),
    }));
};

const fetchProduct = async (productId: string) => {
    return await fetch(`http://165.22.88.161:5567/product/${productId}`).then(async (res) => ({
        status: res.status,
        body: await res.json(),
    }));
};

const ProductUpdatePage = (props: Props) => {
    const {categories, product} = props;
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [slug, setSlug] = useState(product.slug);
    const [main, setMain] = useState<FileList>();
    const [extra, setExtra] = useState<FileList>();
    const [categoryIdList, setCategoryIdList] = useState<string[]>(product.categoryIdList);
    const Alert = withReactContent(Swal);
    const {token} = useContext(UserContext);

    const formData = useMemo(() => {
        if (typeof window !== 'undefined') {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('slug', slug);
            categoryIdList.map(id => formData.append('categoryIdList[]', id));
            if (main && main[0]) {
                formData.append('main', main[0]);
            }
            if (extra) {
                Object.keys(extra).forEach((key: string) => {
                    formData.append('extra', extra[+key]);
                });
            }

            return formData;
        }
    }, [name, slug, description, categoryIdList, main, extra]);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = fetch(`http://165.22.88.161:5567/product/${product._id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            method: 'PUT',
            body: formData,
        });

        const {status} = await response.then(async (res) => ({status: res.status, body: await res.json()}));

        if (status === 200) {
            await Alert.fire({
                title: 'Product updated',
                icon: 'success',
            });
            window.location.href = `/product/detail/${product._id}`;
        } else {
            await Alert.fire({
                title: 'Error',
                text: 'Form is invalid',
                icon: 'error',
            });
        }
    }, [formData]);

    return (
        <Card>
            <Card.Header>
                <Card.Title>Update Product</Card.Title>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" defaultValue={name}
                                      onChange={e => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="slug">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control type="text" placeholder="Enter slug" defaultValue={slug}
                                      onChange={e => setSlug(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <textarea onChange={e => setDescription(e.target.value)} className="form-control" rows={6}
                                  id="description" placeholder="Enter description" defaultValue={description}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="categoryIdList">
                        <Form.Label>Categories</Form.Label>
                        <select className="form-control" id="categoryIdList" multiple
                                onChange={e => {
                                    let values: string[] = [];
                                    for (let i = 0; i < categories.length; i++) {
                                        if (e.target.options[i].selected) {
                                            values = [...values, e.target.options[i].value];
                                        }
                                    }
                                    setCategoryIdList(values);
                                }}>
                            {categories.map(category => (
                                <option value={category._id} key={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="main">
                        <Form.Label>Main Image</Form.Label>
                        <Form.Control type="file" placeholder="Main Image"
                                      onChange={e => setMain((e.target as any).files as FileList)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="main">
                        <Form.Label>Extra Images</Form.Label>
                        <Form.Control type="file" placeholder="Main Image" multiple
                                      onChange={e => setExtra((e.target as any).files as FileList)}/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

ProductUpdatePage.getInitialProps = async (ctx: NextPageContext) => {
    const {body: categoriesBody} = await fetchCategories();
    const {body: productBody} = await fetchProduct(ctx.query.id as string);

    return {categories: categoriesBody.data, product: productBody.data.product};
};

export default ProductUpdatePage;
