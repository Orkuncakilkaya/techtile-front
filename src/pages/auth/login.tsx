import React, {useCallback, useState} from 'react';
import {Button, Card, Form} from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const AuthLoginPage = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const Alert = withReactContent(Swal);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = fetch('http://localhost:5567/auth/login', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({name, password}),
        });

        const {status, body} = await response.then(async (res) => ({status: res.status, body: await res.json()}));

        if (status === 200) {
            await Alert.fire({
                title: 'Logged In!',
                icon: 'success',
            });
            window.location.href = '/';
        } else {
            await Alert.fire({
                title: 'Error',
                text: 'Credentials are not valid',
                icon: 'error',
            });
        }
    }, [name, password]);

    return (
        <Card>
            <Card.Header>
                <Card.Title>Login</Card.Title>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Username or Email</Form.Label>
                        <Form.Control type="text" placeholder="Enter Username or Email"
                                      onChange={e => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"
                                      onChange={e => setPassword(e.target.value)}/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AuthLoginPage;
