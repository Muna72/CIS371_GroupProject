import React, { Component } from "react";
import { Redirect } from "react-router";
import * as firebase from "firebase";

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
        <p onClick={this.handleOnClick}>Logout</p>
      </div>
    );
  }
}

export default Account;
