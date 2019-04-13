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

      var answer = window.confirm("Are you sure you want to PERMENANTLY delete account and all user data?");

      if(answer == true) {

          var emailValue = this.state.user.email;

          rootRef.child('customers').orderByChild('email').equalTo(emailValue).on("value", function(snapshot) {
            console.log(snapshot.val());
              snapshot.forEach(function(data) {
                  var childRef = data;
                  console.log(data.key);
                  childRef.remove();
              });
          });

          let u = firebase.auth().currentUser;

          u.delete().then(function() {
              alert("Account Sucessfully deleted");
          }).catch(function(error) {
              alert("An error occured - action aborted");
          });

          this.setState({ redirect: true });
      }
  }

  updateInfo() {

      var emailValue = this.state.user.email;

      rootRef.child('customers').orderByChild('email').equalTo(emailValue).on("value", function(snapshot) {
          console.log(snapshot.val());
          snapshot.forEach(function(data) {
              var childToUpdate = data.key;
              console.log("child to update" + childToUpdate);

              let u = firebase.auth().currentUser;

              u.updateEmail(this.state.email).then(function() {
                  // Update successful.
              }).catch(function(error) {
                  // An error happened.
              });

              childToUpdate.name = this.state.firstName + " " + this.state.lastname;
              childToUpdate.shippingAddress.streetAddress = this.state.streetAddress;
              childToUpdate.shippingAddress.city = this.state.city;
              childToUpdate.shippingAddress.country = this.state.country;
              childToUpdate.shippingAddress.state = this.state.state;
              childToUpdate.shippingAddress.zip = this.state.zip;
          });
      });
  }

  changePassword() {

      if(this.state.currentPassword == this.state.user.password)
      {
          if(this.state.newPassword == this.state.confirmPassword) {

              let u = firebase.auth().currentUser;

              u.updatePassword(this.state.newPassword).then(function() {
                  alert("Password updated successfully");
              }).catch(function(error) {
                  alert("An error occured - action aborted");
              });

          } else {
              alert("New password fields do not match. Please re-enter new password.");
          }
      } else {
          alert("Entry for current password is incorrect");
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
        <h2>Account</h2>
              <h1>Welcome, {this.state.user.email}!</h1>
              <h3>User Account Home Page</h3><br></br><br></br>
              <h2>Account Information</h2>
              <div id="userInfoForm">
                  <label>Name:</label>
                  console.log({this.state.user.email});
                  <input type="text" id="name" value={this.state.user.name} onChange={e => this.handleInputChange(e, "fullName")}/>
                  <label htmlFor="email">Email:</label>
                  <input type="text" id="email" value={this.state.user.email} onChange={e => this.handleInputChange(e, "email")}/>
                  <label htmlFor="address">Street Address:</label>
                  <input type="text" id="address"  value={this.state.user.shippingAddress.streetAddress} onChange={e => this.handleInputChange(e, "address")}/>
                  <label htmlFor="city">City:</label>
                  <input type="text" id="city"  value={this.state.user.shippingAddress.city} onChange={e => this.handleInputChange(e, "city")}/>
                  <label htmlFor="state">State:</label>
                  <input type="text" id="state" value={this.state.user.shippingAddress.state} onChange={e => this.handleInputChange(e, "state")}/>
                  <label htmlFor="zip">Zip Code:</label>
                  <input type="text" id="zip" value={this.state.user.shippingAddress.zip} onChange={e => this.handleInputChange(e, "zip")}/>
                  <label htmlFor="country">Country:</label>
                  <input type="text" id="country" value={this.state.user.shippingAddress.country} onChange={e => this.handleInputChange(e, "country")}/>
                  <input type="submit" value="Submit Changes" onClick="updateInfo()"/>
                  <p>Change Your Password</p>
                  <label htmlFor="password">Current Password:</label>
                  <input type="text" id="password" onChange={e => this.handleInputChange(e, "currentPassword")}/>
                  <label htmlFor="newPassword">New Password:</label>
                  <input type="text" id="newPassword" onChange={e => this.handleInputChange(e, "newPassword")}/>
                  <label htmlFor="confirmPassword">Confirm New Password:</label>
                  <input type="text" id="confirmPassword" onChange={e => this.handleInputChange(e, "confirmPassword")}/>
                  <input type="submit" value="Update" onclick="changePassword()" />
                  <p>Delete Account</p>
                  <input type="submit" value="Delete" onClick="removeAccount()"/>
              </div>
              <div class="sideNav">
                  <a href="">My Orders</a>
                  <a href="#">Payment Options</a>
                  <a href="#">Current Cart</a>
              </div>
        <p onClick={this.handleOnClick}>Logout</p>
      </div>
    );
  }
}

export default Account;
