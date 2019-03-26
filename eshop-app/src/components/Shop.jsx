import React, { Component } from "react";
import * as firebase from "firebase";

var products = [
  {
    name: "iPhone X",
    price: 800,
    imgUrl:
      "https://www.att.com/catalog/en/idse/Apple/Apple%20iPhone%20X/Space%20Gray-hero-zoom.png",
    quantityRemaining: 4,
    productID: 1001
  },
  {
    name: '15" Macbook Pro 2018, 256gb',
    price: 1250.0,
    imgUrl:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/image/AppleInc/aos/published/images/m/bp/mbp15touch/space/mbp15touch-space-select-201807?wid=1808&hei=1680&fmt=jpeg&qlt=80&.v=1529520056969",
    quantityRemaining: 7,
    productID: 1002
  },
  {
    name: "Samsung Galaxy S8",
    price: 1450.0,
    imgUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41tsp7FIVgL._SL500_AC_SS350_.jpg",
    quantityRemaining: 1,
    productID: 1003
  }
];

const GenerateItems = () => {
  const items = products.map(product => (
    <div key={product.productID} className="storeItem">
      <div className="thumbnailContainer">
        <img src={product.imgUrl} className="thumbnail" alt="" />
      </div>
      <div className="itemActions">
        <input type="number" min="0" max={product.quantityRemaining} />
        <button>Add to Cart</button>
        <p className="quantityRemaining">
          Quantity Remaining: {product.quantityRemaining}
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
};

class Shop extends Component {
  constructor() {
    super();
    this.state = {
      products: [
        {
          name: "iPhone X",
          price: 800,
          imgUrl:
            "https://www.att.com/catalog/en/idse/Apple/Apple%20iPhone%20X/Space%20Gray-hero-zoom.png",
          quantityRemaining: 4,
          productID: 1001
        },
        {
          name: '15" Macbook Pro 2018, 256gb',
          price: 1250.0,
          imgUrl:
            "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/image/AppleInc/aos/published/images/m/bp/mbp15touch/space/mbp15touch-space-select-201807?wid=1808&hei=1680&fmt=jpeg&qlt=80&.v=1529520056969",
          quantityRemaining: 7,
          productID: 1002
        },
        {
          name: "Samsung Galaxy S8",
          price: 1450.0,
          imgUrl:
            "https://images-na.ssl-images-amazon.com/images/I/41tsp7FIVgL._SL500_AC_SS350_.jpg",
          quantityRemaining: 1,
          productID: 1003
        }
      ]
    };
  }

  // called after rendered to DOM
  componentDidMount() {
    // set up listeners and download data to be rendered to DOM
    const rootRef = firebase.database().ref(); // ref() points to root node without arguement
    const productsRef = rootRef.child("products");

    productsRef.on("child_added", snapshot => {
      var product = snapshot.val();
      console.log(product.name);

      var key = snapshot.ref.key;

      this.setState({
        products: snapshot.child(key).val()
      });
    });
  }

  render() {
    return (
      <div className="main">
        <GenerateItems />
      </div>
    );
  }
}

export default Shop;
