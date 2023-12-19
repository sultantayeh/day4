import React, { Component } from 'react';
import {storeProducts, detailProduct} from './data';

const ProductContext = React.createContext();

class ProductProvider extends Component {
   state = {
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0,
   };
   componentDidMount(){
    this.setProducts();


   }
   setProducts = () => {
       let tempProducts = [];
       storeProducts.forEach(item => {
           const singleItem = {...item} ;
           tempProducts = [...tempProducts, singleItem];


       });
    this.setState(()=>{
        return {products: tempProducts}
    });
   }

   getItem = (id) =>{
       const product = this.state.products.find(item => item.id === id);
       return product;

   }

   handleDetail = (id) => {
       const product = this.getItem(id);
       this.setState(
           ()=>{
               return {detailProduct: product}
           }
       );
    }
   addToCart = (id) => {

       let tempProducts = [...this.state.products];
       const index = tempProducts.indexOf(this.getItem(id));
       const product = tempProducts[index];
       product.inCart = true;
       product.count = 1;
       const price = product.price;
       product.total = price;
       this.setState(() => {
           return {products: tempProducts, cart: [...this.state.cart, product] }
       },()=>{
           this.addTotals()

       });

    }
    openModal = id =>{
        const product = this.getItem(id);
        this.setState(()=>{
            return {
                modalProduct: product,
                modalOpen: true,

            }
        });
    }
    closeModal = () => {
        this.setState(()=>{
            return {modalOpen: false}
        });
    }
    increment = (id) => {
        //Always start basic to a component that  makes sure it  being displayed in the screen primarily.
        //console.log('this is increment method');

        let tempCart = [...this.state.cart];
        const selectedProduct =  tempCart.find(item => item.id === id);
        const index= tempCart.indexOf(selectedProduct);
        const product = tempCart[index];

        product.count = product.count + 1;
        product.total = product.count * product.price;

        this.setState(()=>{
            return {cart: [...tempCart]}
            //5.34
        }, ()=>{
            this.addTotals();
        });
    }
    decrement = (id) => {
        //Always start basic to a component that  makes sure it  being displayed in the screen primarily.
        //console.log('this is decrement method');

        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => item.id === id);
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];

        product.count = product.count - 1;

        if(product.count === 0){
            this.removeItem(id)
        }else{
            product.total = product.count * product.price;

            this.setState(()=>{
                return {cart: [...tempCart]};
            },()=>{
                this.addTotals();
                //5.41
            }
            );
        }
    }
    removeItem = (id) => {
        //5.28 highly important piece below
        let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];
        tempCart = tempCart.filter(item => item.id !== id);
        const index = tempProducts.indexOf(this.getItem(id));
        let removedProduct = tempProducts[index];
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;


        this.setState(()=>{
            return {
                cart: [...tempCart],
                products: [...tempProducts]
            }
        }, ()=>{
            this.addTotals();
        });
    }
    clearCart = () => {
        //console.log('cart was cleared');

        this.setState(()=>{
            //just like down it is really simple
            return {cart: []}
        },()=>{
            this.setProducts();
            this.addTotals();

        }
        );
    }
    addTotals =()=>{
        let subTotal = 0;
        this.state.cart.map(item => (subTotal += item.total));
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = subTotal + tax;
        this.setState(()=>{
            return ({
                cartSubTotal: subTotal,
                cartTax: tax,
                cartTotal: total,


            });
        });


    }



    render() {
        return (
            <ProductContext.Provider value = {{
                    ...this.state,
                    handleDetail: this.handleDetail,
                    addToCart: this.addToCart,
                    openModal: this.openModal,
                    closeModal: this.closeModal,
                    increment: this.increment,
                    decrement: this.decrement,
                    removeItem: this.removeItem,
                    clearCart: this.clearCart

            }}>

                {this.props.children}
            </ProductContext.Provider>
        );
    }
}
const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer};
