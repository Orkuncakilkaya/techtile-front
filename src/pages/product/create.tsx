import React, {useCallback, useContext, useMemo, useState} from 'react';
import {Button, Card, Form} from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import UserContext from '../../context/user.context';
import {CategoryModel} from '../../models/category/category.model';

interface Props {
    categories: CategoryModel[];
}

const fetchCategories = async () => {
    return await fetch('http://165.22.88.161:5567/category').then(async (res) => ({
        status: res.status,
        body: await res.json(),
    }));
};

const ProductCreatePage = (props: Props) => {
    const {categories} = props;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [main, setMain] = useState<FileList>();
    const [extra, setExtra] = useState<FileList>();
    const [categoryIdList, setCategoryIdList] = useState<string[]>([]);
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

        const response = fetch('http://165.22.88.161:5567/product', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            method: 'POST',
            body: formData,
        });

        const {status} = await response.then(async (res) => ({status: res.status, body: await res.json()}));

        if (status === 200) {
            await Alert.fire({
                title: 'Product created',
                icon: 'success',
            });
            window.location.href = '/';
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
                <Card.Title>Create Product</Card.Title>
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
                        Create
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

ProductCreatePage.getInitialProps = async () => {
    const {body} = await fetchCategories();

    return {categories: body.data};
};

export default ProductCreatePage;
