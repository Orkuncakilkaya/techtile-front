import React, {useContext} from 'react';
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import UserContext from '../../context/user.context';

interface Props {
    children: React.ReactElement;
}

const MainLayout = (props: Props) => {
    const {children} = props;
    const {user, isLoggedIn} = useContext(UserContext);

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">TechTile Masonry</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav" className="align-self-end">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <NavDropdown title={isLoggedIn ? `Welcome, ${user?.fullName}` : 'User Area'}
                                         id="basic-nav-dropdown">
                                {!isLoggedIn && (
                                    <>
                                        <NavDropdown.Item href="/auth/login">Login</NavDropdown.Item>
                                        <NavDropdown.Item href="/auth/register">Register</NavDropdown.Item>
                                    </>
                                )}
                                {isLoggedIn && (
                                    <>
                                        <NavDropdown.Item href="/category/create">Create Category</NavDropdown.Item>
                                        <NavDropdown.Item href="/product/create">Create Product</NavDropdown.Item>
                                    </>
                                )}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="pt-4">
                {children}
            </Container>
        </>
    );
};

export default MainLayout;
