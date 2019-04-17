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

    getCurrentProduct = async () => {
        //console.log(this.props.match.params.key);

        //declare props for product in state
        let product = Object.assign({}, this.state.product);
        var description;
        var imgUrl;
        var name;
        var onHand;
        var price;
       
        //reference to firebase db
        const rootRef = firebase.database().ref();
        //reference to products collection
        const productsRef = rootRef.child("products");
        //reference to the single product
        const productRef = productsRef.child(this.props.match.params.key);
        //var product = firebase.Object(productRef);
        //var product = {};

        //calls on the product once and sets the props
        productRef.once("value")
        .then(snapshot => {
            console.log(snapshot.val());
            //product = snapshot.val();
            description = snapshot.child("description").val();
            imgUrl = snapshot.child("imgUrl").val();
            name = snapshot.child("name").val();
            onHand = snapshot.child("onHand").val();
            price = snapshot.child("price").val();
        }).then(console.log(product));
        
        return Promise.resolve({
                description: description,
                imgUrl: imgUrl,
                name: name,
                onHand: onHand,
                price: price
        });
        
    }

    componentDidMount = async () => {
        const product = await this.getCurrentProduct()
        
        this.setState({
            product: product
        });
        
    }

    render() {
        console.log(this.state.product); //prints out an empty object + the product
        if (this.state.product === null) {
            return <div><p>Loading Product</p></div>
        }
        console.log(this.state.product);
        return <div>
            <p></p>
        </div>
    }
}

export default Product;
