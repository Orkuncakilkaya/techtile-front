import React from 'react';
import {ProductModel} from '../models/product/product.model';
import {NextPageContext} from 'next';

interface Props {
    products: ProductModel[];
}

const Home = (props: Props) => {
    const {products} = props;
    return (
        <div className="masonry">
            {products.map(product => (
                <a className="item" key={product._id} href={`/product/detail/${product._id}`}>
                    <img src={`http://165.22.88.161:5567/${product.mainImageUrl}`}
                         style={{height: '100%', objectFit: 'contain'}}
                         className="img-fluid"
                         alt={product.name}/>
                </a>
            ))}
        </div>
    );
};

Home.getInitialProps = async (ctx: NextPageContext) => {
    const res = await fetch('http://165.22.88.161:5567/product').then(res => res.json());

    return {products: res.data};
};

export default Home;
