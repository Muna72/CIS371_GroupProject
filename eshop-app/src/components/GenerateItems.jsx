import React, { Component } from "react";
import * as firebase from "firebase";
import { Redirect } from "react-router";
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

    productsRef.on("child_added", snapshot => {
      var product = snapshot.val();

      // give each object a temporary element containing their key
      product.key = snapshot.key;

      // fix me: you need the key here.
      storeProducts.push(product);

      // console.log(storeProducts);

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
    firebase
      .database()
      .ref("customers/" + user.uid)
      .child("cart")
      .update({
        [productKey]: parseInt(quantity, 10)
      });
  }

  addToCart = (productKey, quantity) => {
    // if they are not logged in, go to the sign in page
    if (this.state.user && Object.keys(this.state.user).length === 0) {
      this.setState({ redirect: true });
    } else {
      // user is logged in. add the item to the cart.

      this.writeUserData(this.state.user, productKey, quantity);
      this.resetQuantity();
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

    items = storeProducts.map(product => (
      <div key={product.key} className="storeItem">
        <div className="thumbnailContainer">
          <img src={product.imgUrl} className="thumbnail" alt="" />
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
