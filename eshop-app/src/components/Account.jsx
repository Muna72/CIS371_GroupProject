import React, { Component } from "react";
import { Redirect } from "react-router";
import * as firebase from "firebase";
import { firebaseConfig } from "../config";
import { withRouter } from "react-router-dom";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

class Account extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false
    };
  }

  handleOnClick = () => {
    // some action...
    // then redirect
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.redirect) {
      firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          firebase.auth().signOut();
        }
      });

      return <Redirect push to="/" />;
    }

    return (
      <div className="main">
        <h2>Account</h2>
              <h1>Welcome, !</h1>
              <h3>User Account Home Page</h3><br></br><br></br>
              <h2>Account Information</h2>
              <form id="userInfoForm">
                  <label>First Name:</label>
                  <input type="text" name="firstName" />
                  <label>Last Name:</label>
                  <input type="text" name="lastName" />
                  <label htmlFor="address">Street Address:</label>
                  <input type="text" name="address" />
                  <label htmlFor="city">City:</label>
                  <input type="text" name="city" />
                  <label htmlFor="state">State:</label>
                  <input type="text" name="state" />
                  <label htmlFor="zip">Zip Code:</label>
                  <input type="text" name="zip" />
                  <label htmlFor="email">Email:</label>
                  <input type="text" name="email" />
                  <p>Change Your Password</p>
                  <label htmlFor="password">Current Password:</label>
                  <input type="text" name="password" />
                  <label htmlFor="newPassword">New Password:</label>
                  <input type="text" name="newPassword" />
                  <label htmlFor="confirmPassword">Confirm New Password:</label>
                  <input type="text" name="confirmPassword" />
                  <input type="submit" value="Submit Changes" />
              </form>
              <div id="sideNavigation">
                  <a href="#">My Orders</a>
                  <a href="#">Payment</a>
              </div>
        <p onClick={this.handleOnClick}>Logout</p>
      </div>
    );
  }
}

export default Account;
