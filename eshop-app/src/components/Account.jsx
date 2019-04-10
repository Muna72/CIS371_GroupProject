import React, { Component } from "react";
import { Redirect } from "react-router";
import * as firebase from "firebase";
import { firebaseConfig } from "../config";
import { withRouter } from "react-router-dom";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

var db = firebase.database();
var rootRef = db.ref();
//rootRef.on('child_removed', signupRedirect);
//rootRef.on('child_changed', reloadData); //TODO don't need?

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  handleOnClick = () => {
    // some action...
    // then redirect
    this.setState({ redirect: true });
  };

  removeAccount() {

      //var answer = confirm("Are you sure you want to PERMENANTLY delete account and all user data?");
var answer = false;
      if(answer == true) {

          var emailValue = document.getElementById("email").value;

          rootRef.child('customers').orderByChild('email').equalTo(emailValue).on("value", function(snapshot) {
            console.log(snapshot.val());
              snapshot.forEach(function(data) {
                  console.log(data.key);
                  //childRef.remove();
              });
          });

          this.setState({ redirect: true });
      }
  }

  updateInfo() {

      var emailValue = document.getElementById("email").value;

      rootRef.child('customers').orderByChild('email').equalTo(emailValue).on("value", function(snapshot) {
          console.log(snapshot.val());
          snapshot.forEach(function(data) {
              var childToUpdate = data.key;
              console.log(childToUpdate);
              childToUpdate.email = document.getElementById("email").value;
              childToUpdate.name = document.getElementById("firstName").value + " " + document.getElementById("lastName").value;
              childToUpdate.userName = document.getElementById("userName").value;
              childToUpdate.shippingAddress.streetAddress = document.getElementById("address").value;
              childToUpdate.shippingAddress.city = document.getElementById("city").value;
              childToUpdate.shippingAddress.country = document.getElementById("country").value;
              childToUpdate.shippingAddress.state = document.getElementById("state").value;
              childToUpdate.shippingAddress.zip = document.getElementById("zip").value;
          });
      });
  }

  changePassword() {

      var emailValue = document.getElementById("email").value;

      rootRef.child('customers').orderByChild('email').equalTo(emailValue).on("value", function(snapshot) {
          console.log(snapshot.val());
          snapshot.forEach(function(data) {
              var childToUpdate = data.key;
              console.log(childToUpdate);
              childToUpdate.password = document.getElementById("newPassword").value;
          });
      });

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
        <h2>Account</h2>
              <h1>Welcome, !</h1>
              <h3>User Account Home Page</h3><br></br><br></br>
              <h2>Account Information</h2>
              <form id="userInfoForm">
                  <label htmlFor="user name">User Name:</label>
                  <input type="text" name="userName" id="userName"/>
                  <label>First Name:</label>
                  <input type="text" name="firstName" id="firstName"/>
                  <label>Last Name:</label>
                  <input type="text" name="lastName" id="lastName"/>
                  <label htmlFor="email">Email:</label>
                  <input type="text" name="email" id="email"/>
                  <label htmlFor="address">Street Address:</label>
                  <input type="text" name="address" id="address" />
                  <label htmlFor="city">City:</label>
                  <input type="text" name="city" id="city" />
                  <label htmlFor="state">State:</label>
                  <input type="text" name="state" id="state" />
                  <label htmlFor="zip">Zip Code:</label>
                  <input type="text" name="zip" id="zip" />
                  <label htmlFor="country">Country:</label>
                  <input type="text" name="country" id="country" />
                  <input type="submit" value="Submit Changes" onClick="updateInfo()"/>
                  <p>Change Your Password</p>
                  <label htmlFor="password">Current Password:</label>
                  <input type="text" name="password" id="password" />
                  <label htmlFor="newPassword">New Password:</label>
                  <input type="text" name="newPassword" id="newPassword" />
                  <label htmlFor="confirmPassword">Confirm New Password:</label>
                  <input type="text" name="confirmPassword" id="confirmPassword" />
                  <input type="submit" value="Update" onclick="changePassword()" />
                  <p>Delete Account</p>
                  <input type="submit" value="Delete" onClick="removeAccount()"/>

              </form>
              <div class="sideNav">
                  <a href="#">My Orders</a>
                  <a href="#">Payment Options</a>
                  <a href="#">Current Cart</a>
              </div>
        <p onClick={this.handleOnClick}>Logout</p>
      </div>
    );
  }
}

export default Account;
