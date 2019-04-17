import React, { Component } from "react";
import * as firebase from "firebase";
import { Redirect } from "react-router";
import { NavLink } from "react-router-dom";
import CurrencyFormat from "react-currency-format";

var storeProducts = [];
var items = null;

class GenerateItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      products: [],
      user: {},
      quantity: 1
    };

    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.getCurrentUser();
    }
    // set up listeners and download data to be rendered to DOM
    const rootRef = firebase.database().ref(); // ref() points to root node without arguement
    const productsRef = rootRef.child("products");

    storeProducts = [];

    productsRef.on("value", snapshot => {
      storeProducts = [];
      snapshot.forEach(function(product) {
        // give each object a temporary element containing their key
        var nextProduct = product.val();
        nextProduct.key = parseInt(product.key);

        storeProducts.push(nextProduct);
      });

      if (this._isMounted) {
        this.setState({
          products: storeProducts
        });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getCurrentUser = () => {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        this.setState({
          user: firebase.auth().currentUser
        });
      }
    });
  };

  writeUserData(user, productKey, quantity) {
    // first check to make sure there is enough remaining before adding it to the cart
    var quantityRemaining;

    firebase
      .database()
      .ref("/products/" + productKey)
      .child("onHand")
      .once("value")
      .then(function(snapshot) {
        quantityRemaining = snapshot.val();

        if (quantityRemaining < quantity) {
          alert("Not enough remain!");
        } else {
          firebase
            .database()
            .ref("customers/" + user.uid)
            .child("cart")
            .update({
              [productKey]: parseInt(quantity, 10)
            });
        }
      });
  }

  addToCart = (productKey, quantity) => {
    // if they are not logged in, go to the sign in page
    if (quantity > 0) {
      if (this.state.user && Object.keys(this.state.user).length === 0) {
        this.setState({ redirect: true });
      } else {
        // user is logged in. add the item to the cart.
        this.writeUserData(this.state.user, productKey, quantity);
        this.resetQuantity();
      }
    }
  };

  resetQuantity() {
    this.setState({ quantity: 1 });
  }

  // handle input changed.
  handleInputChange = (e, name) => {
    this.setState({
      [name]: e.target.value
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/SignIn/" />;
    }

    items = null;

    // key could also be product.key
    items = storeProducts.map((product, index) => (
      <div key={index} className="storeItem">
        <div className="thumbnailContainer">
        <NavLink to={`/Product/${product.key}`}>
            <img src={product.imgUrl} className="thumbnail" alt="" />
        </NavLink>
        </div>
        <div className="itemActions">
          <input
            type="number"
            min="0"
            max={product.onHand}
            value={this.state.quantity}
            onChange={e => this.handleInputChange(e, "quantity")}
          />

          <button
            onClick={() => this.addToCart(product.key, this.state.quantity)}
          >
            Add to Cart
          </button>
          <p className="quantityRemaining">
            Quantity Remaining: {product.onHand}
          </p>
        </div>
        <div className="itemDetails">
          <p>
            <b>{product.name}</b>
          </p>
          <CurrencyFormat
            value={product.price}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
            decimalScale={2}
            fixedDecimalScale={true}
            renderText={value => <div>{value}</div>}
          />
        </div>
      </div>
    ));

    return <div>{items}</div>;
  }
}

export default GenerateItems;
