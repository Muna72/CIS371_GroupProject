import React, { Component } from "react";
import * as firebase from "firebase";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      product: {}
    };
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
    productRef.once("value").then(snapshot => {
      console.log(snapshot.val());
      this.setState({
        product: {
          description: snapshot.child("description").val(),
          name: snapshot.child("name").val(),
          imgUrl: snapshot.child("imgUrl").val(),
          onHand: snapshot.child("onHand").val(),
          price: snapshot.child("price").val()
        }
      });
    });
  };

  componentDidMount = () => {
    this.getCurrentProduct();
  };

  render() {
    console.log(this.state.product); //prints out an empty object + the product
    //if the product has not loaded, this div will be shown
    if (this.state.product === {}) {
      return (
        <div>
          <p>Loading Product</p>
        </div>
      );
    } else {
      return (
        <div className="product-container">
          <div className="product-image-container">
            <h1>{this.state.product.name}</h1>
            <img
              src={this.state.product.imgUrl}
              className="largeImage"
              alt=""
            />
          </div>
          <div className="product-description">
            <p>Quantity Remaining: {this.state.product.onHand}</p>
            <p>Price: ${this.state.product.price}</p>
            <p>{this.state.product.description}</p>
          </div>
        </div>
      );
    }
    //Once firebase gets the product information, it will be rendered here
  }
}

export default Product;
