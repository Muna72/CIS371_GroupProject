import React, { Component } from "react";
import * as firebase from "firebase";

var storeProducts = [];

class GenerateItems extends Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
  }

  // called after rendered to DOM
  componentDidMount() {
    // set up listeners and download data to be rendered to DOM
    const rootRef = firebase.database().ref(); // ref() points to root node without arguement
    const productsRef = rootRef.child("products");

    productsRef.on("child_added", snapshot => {
      var product = snapshot.val();

      storeProducts.push(product);

      this.setState({
        products: storeProducts
      });
    });
  }

  render() {
    var items = storeProducts.map(product => (
      <div key={product.productID} className="storeItem">
        <div className="thumbnailContainer">
          <img src={product.imgUrl} className="thumbnail" alt="" />
        </div>
        <div className="itemActions">
          <input type="number" min="0" max={product.onHand} />
          <button>Add to Cart</button>
          <p className="quantityRemaining">
            Quantity Remaining: {product.onHand}
          </p>
        </div>
        <div className="itemDetails">
          <p>
            <b>{product.name}</b>
          </p>
          <p>${product.price}</p>
        </div>
      </div>
    ));

    return <div>{items}</div>;
  }
}

export default GenerateItems;
