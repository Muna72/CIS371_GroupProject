import React, { Component } from 'react';
import * as firebase from "firebase";

class Product extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key: 0,
            product: {}
        }
    }

    //returns a product as a promise
    getCurrentProduct = async () => {      
       
        //reference to firebase db
        const rootRef = firebase.database().ref();
        //reference to products collection
        const productsRef = rootRef.child("products");
        //reference to the single product
        const productRef = productsRef.child(this.props.match.params.key);

        //calls on the product once and sets the props
        productRef.once("value")
        .then(snapshot => {
            console.log(snapshot.val());
            this.setState({
                product: {
                    description: snapshot.child("description").val(),
                    name: snapshot.child("name").val(),
                    onHand: snapshot.child("onHand").val(),
                    price: snapshot.child("price").val(),
                }
            })
        });
        
    }

    componentDidMount =  () => {
        this.getCurrentProduct();        
    }

    render() {
        console.log(this.state.product); //prints out an empty object + the product
        //if the product has not loaded, this div will be shown
        if (this.state.product === null) {
            return <div><p>Loading Product</p></div>
        }
        console.log(this.state.product);
        //Once firebase gets the product information, it will be rendered here
        return <div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <p>{this.state.product.name}</p>
            <p>{this.state.product.onHand}</p>
            <p>Price: ${this.state.product.price}</p>
            
        </div>
    }
}

export default Product;
