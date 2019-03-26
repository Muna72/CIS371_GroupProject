import React, { Component } from "react";

class Account extends Component {
  /*   state = {
    email: "",
    name: "",
    orders: [{ productsInOrder: [], totalPrice: 0 }],
    password: "",
    shippingAddress: [
      { city: "", country: "", state: "", streetName: "", streetNum: 0, zip: 0 }
    ]
  }; */

  render() {
    return (
      <div className="main">
        <h2>Account</h2>
        <div id="firebaseui-auth-container" />
        <div id="loader">Loading...</div>
      </div>
    );
  }
}

export default Account;
