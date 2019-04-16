import React, { Component } from "react";
import * as firebase from "firebase";
import CurrencyFormat from "react-currency-format";

var accountOrders = [];
var orders = null;

class GenerateOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      orders: []
    };
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

  handleOnClick = () => {
    // some action...
    // then redirect
    this.setState({ redirect: true });
  };

  // called after rendered to DOM
  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.getCurrentUser();
    }

    this.setState({
      orders: null
    });

    accountOrders = [];
  }

  stateIsSet = () => {
    // fetch the current items in the cart
    const rootRef = firebase.database().ref();
    const ordersRef = rootRef
      .child("customers")
      .child(this.state.user.uid)
      .child("orders");

    ordersRef.on("child_added", snapshot => {
      var order = snapshot.val();

      accountOrders.push(order);

      this.setState({
        orders: accountOrders
      });
    });
  };

  render() {
    if (accountOrders.length > 0) {
      // display newest orders first
      accountOrders.reverse();
      orders = accountOrders.map(order => (
        <div className="orderDetails">
          <div className="orderHeader">Order from {order.orderDate}</div>
          <ul>
            {Object.keys(order.productsInOrder).map(product => (
              <li>
                <span className="itemName">{product}</span>
                <span className="itemPrice">
                  ${order.productsInOrder[product]}
                </span>
              </li>
            ))}
          </ul>
          <div className="orderPrice">
            <CurrencyFormat
              value={order.totalPrice}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
              decimalScale={2}
              fixedDecimalScale={true}
              renderText={value => <div>Total Order Price: {value}</div>}
            />
          </div>
        </div>
      ));

      return <div>{orders}</div>;
    } else {
      return (
        <div>
          <h2 id="ordersNote">You have no past orders yet</h2>
        </div>
      );
    }
  }
}

export default GenerateOrders;
