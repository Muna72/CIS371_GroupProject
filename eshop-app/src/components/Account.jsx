import React, { Component } from "react";
import * as firebase from "firebase";
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";

var db = firebase.database();
var rootRef = db.ref();
var childToUpdate;
//rootRef.on('child_changed', reloadData);

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: {}
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

  handleOnClick = () => {
    // some action...
    // then redirect
    this.setState({ redirect: true });
  };

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.getCurrentUser();
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

    if (answer == true) {
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

    var childToUpdate = rootRef.child("customers").child(this.state.user.uid);
     /* var e = this.state.user.email;
      rootRef.child("customers").orderByChild(this.state.user.uid).on("value", function (snapshot) {
          snapshot.forEach(function (child) {
              if(child.val().email == e) {
                  childToUpdate = child.val();
              }
          });
      }); */

      if(this.state.email) {
          let u = firebase.auth().currentUser;

          u.updateEmail(this.state.email)
              .then(function () {
                  // Update successful.
              })
              .catch(function (error) {
                  // An error happened.
              });
      }

    childToUpdate.name = this.state.name;
    childToUpdate.shippingAddress.streetAddress = this.state.streetAddress;
    childToUpdate.shippingAddress.city = this.state.city;
    childToUpdate.shippingAddress.country = this.state.country;
    childToUpdate.shippingAddress.state = this.state.state;
    childToUpdate.shippingAddress.zip = this.state.zip;
  }

  changePassword() {
    if (this.state.newPassword == this.state.confirmPassword) {
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
            defaultValue={this.state.user.name}
            onChange={e => this.handleInputChange(e, "fullName")}
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            size="35"
            defaultValue={this.state.user.email}
            onChange={e => this.handleInputChange(e, "email")}
          />
          <br />
          <label htmlFor="address">Street Address:</label>
          <input
            type="text"
            id="address"
            size="35"
            defaultValue={this.state.user.shippingAddress}
            onChange={e => this.handleInputChange(e, "address")}
          />
          <br />
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            size="35"
            defaultValue={this.state.user.shippingAddress}
            onChange={e => this.handleInputChange(e, "city")}
          />
          <br />
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            size="35"
            defaultValue={this.state.user.shippingAddress}
            onChange={e => this.handleInputChange(e, "state")}
          />
          <br />
          <label htmlFor="zip">Zip Code:</label>
          <input
            type="text"
            id="zip"
            size="35"
            defaultValue={this.state.user.shippingAddress}
            onChange={e => this.handleInputChange(e, "zip")}
          />
          <br />
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            size="35"
            defaultValue={this.state.user.shippingAddress}
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
