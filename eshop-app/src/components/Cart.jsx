import React, { Component } from "react";
import * as firebase from "firebase";
import { Redirect } from "react-router";
import CurrencyFormat from "react-currency-format";

var cartItems = [];
var correspondingProduct = {};
var items = new Map();
var orderTotal = 0.0;
var newOrder = {};

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: {},
      cartItems: [],
      orderTotal: 0.0,
      orders: []
    };
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.getCurrentUser();
    }
  }

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

          console.log(cartItems);

          that.setState(
            {
              cartItems: cartItems
            },
            that.calculateOrderTotal()
          );
        });
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
        newCart = [];
        correspondingProduct = {};

        // update the state so that the cart refreshes
        that.setState(
          {
            cartItems: cartItems
          },
          that.calculateOrderTotal
        );
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message);
      });
  };

  emptyCart = () => {
    // if they are not logged in, go to the sign in page
    // keep the reference to what THIS is
    var that = this;

    var adaRef = firebase
      .database()
      .ref("customers/" + this.state.user.uid + "/cart/");
    adaRef
      .remove()
      .then(function() {
        // successfully removed entire cart

        // now update the cart list
        cartItems = [];
        correspondingProduct = {};

        // update the state so that the cart refreshes
        that.setState(
          {
            cartItems: []
          },
          that.calculateOrderTotal
        );
      })
      .catch(function(error) {
        console.log("Remove all failed: " + error.message);
      });
  };

  calculateOrderTotal = () => {
    console.log("Calculating order total.");
    // loop through all cart items
    console.log(cartItems);
    orderTotal = 0;

    var numOfItems = cartItems.length;
    for (var i = 0; i < numOfItems; i++) {
      let price = cartItems[i][2].price;
      let quantity = parseInt(cartItems[i][1]);
      orderTotal += price * quantity;
    }

    this.setState({
      orderTotal: orderTotal
    });
  };

    getCurrentOrders = () => {
        // need to get their name and shipping address
        var that = this;

        firebase
            .database()
            .ref("/customers/" + this.state.user.uid)
            .once("value")
            .then(function(snapshot) {
                console.log(snapshot.val());
                var customerInfo = snapshot.val();
                console.log(customerInfo.orders);
                that.setState({
                    orders: customerInfo.orders
                });
                console.log(customerInfo);
            });

    };

    createNewOrder() {

        newOrder = {
            orderDate: new Date(),
            productsInOrder: cartItems,
            totalPrice: this.state.orderTotal
        }

        return newOrder;
    }

    addOrderToAccount = () => {

        this.getCurrentOrders();
        this.state.orders.push(this.createNewOrder());

        var updates = {};
        updates["/customers/" + this.state.user.uid + "/orders/"] = this.state.orders;

        firebase
            .database()
            .ref()
            .update(updates)

        alert("Order completed successfully. Thank you for your business!");
    };

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/SignIn/" />;
    }

    // ERROR: keys are showing as duplicates if a cart item is deleted
    // and added back in without refreshing the page
    // Also, add a total as the last row.
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
        <button className="checkoutBtn" onClick={() => this.addOrderToAccount()}>Proceed to Checkout</button>
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
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td>
                <p>
                  <b>Order Total:</b>
                </p>
                <CurrencyFormat
                  value={this.state.orderTotal}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  renderText={value => <div>{value}</div>}
                />
              </td>
              <td>
                {" "}
                <button
                  onClick={() => this.emptyCart()}
                  className="checkoutBtn emptyCartBtn"
                >
                  Empty Cart
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Cart;
