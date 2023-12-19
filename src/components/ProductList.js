import React, {Component} from 'react';
import Product from "./Product";
import Title from "./Title";
// DONT NEEED     import {storeProducts} from '../data';
import {ProductConsumer} from '../context';
import {detailProduct} from '../data';

export default class ProductList extends Component{

    render(){
        return (
            <React.Fragment>
                <div className="py-5">
                    <div className="container">

                            <Title name="our" title=" products"/>


                            <div className="row">
                            <ProductConsumer>
                                {

                                    value => {
                                        return (
                                            value.products.map( product => { return <Product key={product.id} product={product}/>;} )
                                            );
                                    }
                                }
                            </ProductConsumer>
                            </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}
