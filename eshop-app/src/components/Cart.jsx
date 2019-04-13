import React, { Component } from "react";
import * as firebase from "firebase";
import { Redirect } from "react-router";
import CurrencyFormat from "react-currency-format";

var cartItems = [];
var correspondingProduct = {};
var items = null;

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: {},
      cartItems: []
    };
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.getCurrentUser();
    }
  }

  stateIsSet = () => {
    // fetch the current items in the cart
    const rootRef = firebase.database().ref();
    const customerCartRef = rootRef
      .child("customers")
      .child(this.state.user.uid)
      .child("cart");

    cartItems = [];

    customerCartRef.on("child_added", snapshot => {
      var productKey = snapshot.key;
      var productQuantity = snapshot.val();

      var that = this;

      // get the product matching this key
      firebase
        .database()
        .ref("/products/")
        .child(productKey)
        .once("value")
        .then(function(snapshot) {
          correspondingProduct = snapshot.val();
          correspondingProduct.key = productKey;
          correspondingProduct.quantity = productQuantity;

          cartItems.push([productKey, productQuantity, correspondingProduct]);

          that.setState({
            cartItems: cartItems
          });
        });
    });
  };

  getCurrentUser = () => {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        this.setState(
          {
            user: firebase.auth().currentUser
          },
          this.stateIsSet
        );
      }
    });
  };

  removeFromCart = productID => {
    // if they are not logged in, go to the sign in page
    // keep the reference to what THIS is
    var that = this;

    var adaRef = firebase
      .database()
      .ref("customers/" + this.state.user.uid + "/cart/" + productID);
    adaRef
      .remove()
      .then(function() {
        // successfully removed

        // now update the cart list
        var newCart = [];
        for (var i = 0; i < cartItems.length; i++) {
          if (cartItems[i][0] !== productID) {
            newCart.push(cartItems[i]);
          }
        }

        cartItems = newCart;

        // update the state so that the cart refreshes
        that.setState({
          cartItems: cartItems
        });
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message);
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/SignIn/" />;
    }

    items = cartItems.map(product => (
      <tr key={product[0]}>
        <td>
          <img src={product[2].imgUrl} className="thumbnail" alt="" />
        </td>
        <td>{product[2].name}</td>
        <td>{product[2].description}</td>
        <td>{product[1]}</td>
        <td>
          <CurrencyFormat
            value={product[2].price}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
            decimalScale={2}
            fixedDecimalScale={true}
            renderText={value => <div>{value}</div>}
          />
        </td>
        <td>
          <button
            onClick={() => this.removeFromCart(product[0])}
            className="checkoutBtn"
          >
            Remove
          </button>
        </td>
      </tr>
    ));

    return (
      <div className="main">
        <button className="checkoutBtn">Proceed to Checkout</button>
        <table>
          <tbody>
            <tr>
              <th>Image</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
            {items}
          </tbody>
        </table>
        <button className="checkoutBtn emptyCartBtn">Empty Cart</button>
      </div>
    );
  }
}

export default Cart;
