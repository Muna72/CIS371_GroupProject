import React, { Component } from "react";
import * as firebase from "firebase";
import { Redirect } from "react-router";

var db = firebase.database();
var rootRef = db.ref();

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: {},
      name: "",
      shippingAddress: {},
      city: "",
      country: "",
      state: "",
      streetAddress: "",
      zip: ""
    };
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

  getUserInfo = () => {
    // need to get their name and shipping address
    var that = this;

    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log("Getting user info for " + this.state.user.email);

        return firebase
          .database()
          .ref("/customers/" + this.state.user.uid)
          .once("value")
          .then(function(snapshot) {
            var customerInfo = snapshot.val();
            that.setState({
              name: customerInfo.name,
              shippingAddress: customerInfo.shippingAddress,
              city: customerInfo.shippingAddress.city,
              country: customerInfo.shippingAddress.country,
              state: customerInfo.shippingAddress.state,
              streetAddress: customerInfo.shippingAddress.streetAddress,
              zip: customerInfo.shippingAddress.zip
            });
            console.log(customerInfo);
          });
      }
    });
  };

  handleOnClick = () => {
    // some action...
    // then redirect
    this.setState({ redirect: true });
  };

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.getCurrentUser();
      if (this.state.user.email !== "") {
        this.getUserInfo();
      }
    }
  }

  handleInputChange = (e, name) => {
    this.setState({
      [name]: e.target.value
    });
  };

  removeAccount() {
    var answer = window.confirm(
      "Are you sure you want to PERMENANTLY delete account and all user data?"
    );

    if (answer === true) {
      let childRef = rootRef.child("customers").child(this.state.user.uid);
      childRef.remove();

      let u = firebase.auth().currentUser;

      let credentials = firebase.auth.EmailAuthProvider.credential(
        this.state.user.email,
        "firebase"
      );
      u.reauthenticateWithCredential(credentials);

      u.delete()
        .then(function() {
          alert("Account Sucessfully deleted");
        })
        .catch(function(error) {
          alert("An error occured - action aborted" + error);
        });

      this.setState({ redirect: true });
    }
  }

  updateInfo() {
    console.log("updating info for ", this.state.user.email);

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates["/customers/" + this.state.user.uid + "/name/"] = this.state.name;
    updates[
      "/customers/" + this.state.user.uid + "/shippingAddress/city"
    ] = this.state.city;
    updates[
      "/customers/" + this.state.user.uid + "/shippingAddress/country"
    ] = this.state.country;
    updates[
      "/customers/" + this.state.user.uid + "/shippingAddress/state"
    ] = this.state.state;
    updates[
      "/customers/" + this.state.user.uid + "/shippingAddress/streetAddress"
    ] = this.state.streetAddress;
    updates[
      "/customers/" + this.state.user.uid + "/shippingAddress/zip"
    ] = this.state.zip;

    console.log(
      firebase
        .database()
        .ref()
        .update(updates)
    );
  }

  changePassword() {
    if (this.state.newPassword === this.state.confirmPassword) {
      let u = firebase.auth().currentUser;

      let credentials = firebase.auth.EmailAuthProvider.credential(
        this.state.user.email,
        "firebase"
      );
      u.reauthenticateWithCredential(credentials);

      u.updatePassword(this.state.newPassword)
        .then(function() {
          alert("Password updated successfully");
        })
        .catch(function(error) {
          alert("An error occured - action aborted" + error);
        });
    } else {
      alert("New password fields do not match. Please re-enter new password.");
    }
  }

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
        <h1 id="welcome">Welcome, {this.state.user.email}!</h1>
        <h2 id="acctInfo">Account Information</h2>
        <div id="userInfoForm">
          <label>Name:</label>
          <input
            type="text"
            id="name"
            size="35"
            defaultValue={this.state.name}
            onChange={e => this.handleInputChange(e, "name")}
          />
          <br />
          <label htmlFor="address">Street Address:</label>
          <input
            type="text"
            id="address"
            size="35"
            defaultValue={this.state.shippingAddress.streetAddress}
            onChange={e => this.handleInputChange(e, "streetAddress")}
          />
          <br />
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            size="35"
            defaultValue={this.state.shippingAddress.city}
            onChange={e => this.handleInputChange(e, "city")}
          />
          <br />
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            size="35"
            defaultValue={this.state.shippingAddress.state}
            onChange={e => this.handleInputChange(e, "state")}
          />
          <br />
          <label htmlFor="zip">Zip Code:</label>
          <input
            type="text"
            id="zip"
            size="35"
            defaultValue={this.state.shippingAddress.zip}
            onChange={e => this.handleInputChange(e, "zip")}
          />
          <br />
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            size="35"
            defaultValue={this.state.shippingAddress.country}
            onChange={e => this.handleInputChange(e, "country")}
          />
          <br />
          <input
            type="submit"
            className="submit"
            value="Submit Changes"
            onClick={() => {
              this.updateInfo();
            }}
          />
          <h3 className="acctTitles">Change Your Password</h3>
          <label htmlFor="password">Current Password:</label>
          <input
            type="text"
            id="password"
            onChange={e => this.handleInputChange(e, "currentPassword")}
          />
          <br />
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="text"
            id="newPassword"
            onChange={e => this.handleInputChange(e, "newPassword")}
          />
          <br />
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="text"
            id="confirmPassword"
            onChange={e => this.handleInputChange(e, "confirmPassword")}
          />
          <br />
          <input
            type="submit"
            value="Update"
            className="submit"
            onClick={() => {
              this.changePassword();
            }}
          />
          <h3 className="acctTitles">Delete Account</h3>
          <input
            type="submit"
            value="Delete"
            className="submit"
            onClick={() => {
              this.removeAccount();
            }}
          />
        </div>
        <div className="sidenav">
          <a href="/Orders">My Orders</a>
          <br />
          <a href="/Cart">Current Cart</a>
          <p onClick={this.handleOnClick}>Logout</p>
          <br />
        </div>
      </div>
    );
  }
}

export default Account;
