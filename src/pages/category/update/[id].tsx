import React, {useCallback, useContext, useState} from 'react';
import {Button, Card, Form} from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import {NextPageContext} from 'next';
import UserContext from '../../../context/user.context';
import {CategoryModel} from '../../../models/category/category.model';

interface Props {
    category: CategoryModel | null;
}

const CategoryUpdatePage = (props: Props) => {
    const {category} = props;
    const [name, setName] = useState(category?.name ?? '');
    const [slug, setSlug] = useState(category?.slug ?? '');
    const Alert = withReactContent(Swal);
    const {token} = useContext(UserContext);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = fetch(`http://165.22.88.161:5567/category/${category?._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            method: 'PUT',
            body: JSON.stringify({name, slug}),
        });

        const {status} = await response.then(async (res) => ({status: res.status, body: await res.json()}));

        if (status === 200) {
            await Alert.fire({
                title: 'Category updated',
                icon: 'success',
            });
            window.location.href = '/category';
        } else {
            await Alert.fire({
                title: 'Error',
                text: 'Form is invalid',
                icon: 'error',
            });
        }
    }, [name, slug]);

    return (
        <Card>
            <Card.Header>
                <Card.Title>Update Category</Card.Title>
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

                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

CategoryUpdatePage.getInitialProps = async (ctx: NextPageContext) => {
    const categoryId = ctx.query.id;

    const {body, status} = await fetch(`http://165.22.88.161:5567/category/${categoryId}`).then(async (res) => ({
        status: res.status,
        body: await res.json(),
    }));

    return {category: status === 200 ? body.data : null};
};

export default CategoryUpdatePage;
