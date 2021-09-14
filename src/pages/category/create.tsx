import React, {useCallback, useContext, useState} from 'react';
import {Button, Card, Form} from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import UserContext from '../../context/user.context';

const CategoryCreatePage = () => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const Alert = withReactContent(Swal);
    const {token} = useContext(UserContext);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = fetch('http://localhost:5567/category', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            method: 'POST',
            body: JSON.stringify({name, slug}),
        });

        const {status} = await response.then(async (res) => ({status: res.status, body: await res.json()}));

        if (status === 200) {
            await Alert.fire({
                title: 'Category created',
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
                <Card.Title>Create Category</Card.Title>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name"
                                      onChange={e => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="slug">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control type="text" placeholder="Enter slug"
                                      onChange={e => setSlug(e.target.value)}/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Create
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CategoryCreatePage;
