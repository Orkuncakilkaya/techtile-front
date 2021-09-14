import React, {useContext, useState} from 'react';
import {Button, Card, Table} from 'react-bootstrap';
import {CategoryModel} from '../../models/category/category.model';
import UserContext from '../../context/user.context';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

interface Props {
    categories: CategoryModel[];
}

const fetchCategories = async () => {
    return await fetch('http://165.22.88.161:5567/category').then(async (res) => ({
        status: res.status,
        body: await res.json(),
    }));
};

const CategoryList = (props: Props) => {
    const {token} = useContext(UserContext);
    const [categories, setCategories] = useState<CategoryModel[]>(props.categories ?? []);
    const Alert = withReactContent(Swal);

    const loadCategories = async () => {
        const {body} = await fetchCategories();
        setCategories(body.data);
    };

    const deleteCategory = async (id: string) => {
        const {status} = await fetch(`http://165.22.88.161:5567/category/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            method: 'DELETE',
        }).then(res => ({status: res.status}));
        if (status === 200) {
            await Alert.fire({
                title: 'Category Deleted',
                icon: 'success',
            });
        } else {
            await Alert.fire({
                title: 'Error',
                text: 'Category couldn\'t deleted',
                icon: 'error',
            });
        }
        await loadCategories();
    };

    return (
        <Card>
            <Card.Header>
                <Card.Title>Categories</Card.Title>
            </Card.Header>
            <Card.Body>
                <Table>
                    <thead>
                    <tr>
                        <td>Name</td>
                        <td>
                            <a href="/category/create" className="btn btn-success">
                                Create
                            </a>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(categories) && categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>
                                <Button variant="danger" onClick={() => deleteCategory(category._id)}>Delete</Button>
                                <a href={`/category/update/${category._id}`} className="btn btn-warning">
                                    Update
                                </a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

CategoryList.getInitialProps = async () => {
    const {body} = await fetchCategories();

    return {categories: body.data};
};

export default CategoryList;
