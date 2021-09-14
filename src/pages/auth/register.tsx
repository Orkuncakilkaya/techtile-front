import React, {useCallback, useState} from 'react';
import {Button, Card, Form} from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import {useRouter} from 'next/router';

const AuthRegisterPage = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const Alert = withReactContent(Swal);
    const router = useRouter();

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = fetch('http://localhost:5567/auth/register', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({name, password, fullName, email}),
        });

        const {status} = await response.then(async (res) => ({status: res.status, body: await res.json()}));

        if (status) {
            await Alert.fire({
                title: 'Registration successful',
                icon: 'success',
            });
            await router.replace('/auth/login');
        } else {
            await Alert.fire({
                title: 'Error',
                text: 'User with name or email already exists or password length is incorrect, please try again',
                icon: 'error',
            });
        }
    }, [name, password]);

    return (
        <Card>
            <Card.Header>
                <Card.Title>Register</Card.Title>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Group className="mb-3" controlId="userName">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" onChange={e => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter full name"
                                      onChange={e => setFullName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter Password"
                                      onChange={e => setPassword(e.target.value)}/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AuthRegisterPage;
