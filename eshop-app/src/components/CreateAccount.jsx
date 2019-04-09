import React, { Component } from "react";
import { Redirect } from "react-router";
import * as firebase from "firebase";

class CreateAccount extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      passRepeat: "",
      isValidEmail: false,
      isValidPaswword: false,
      formValid: false,
      redirect: false
    };
    //this.signInUser = this.signInUser.bind(this);
    //this.createUser = this.createUser.bind(this);
    //this.handleInputChange = this.handleInputChange.bind(this);
    //this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validatePassword = e => {
    this.handleInputChange(e);
    this.isValidPassword = this.password === this.passRepeat ? true : false;
  };

  signUpUser = e => {
    e.preventDefault();
    if (!this.isValidPassword) {
      return;
    }
    const auth = firebase.auth();
    let email = this.state.email;
    let pass = this.state.password;

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));

    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        // redirect to new page and update nav
        console.log(firebaseUser);
        this.setState({ redirect: true });
      }
    });
  };

  createUser = e => {
    e.preventDefault();
    const auth = firebase.auth();
    let email = this.state.email;
    let pass = this.state.password;

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));

    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log(firebaseUser);
        this.setState({ redirect: true });
      }
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/" />;
    }
    return (
      <div className="main">
        <div className="sign-up-container">
          <input
            type="email"
            className="field"
            id="email"
            placeholder="Email"
            onChange={this.handleInputChange}
            autoComplete="email"
          />
          <p className="errormsg" id="email-error-1">
            {this.state.error}
          </p>
          <input
            type="password"
            className="field"
            id="password"
            placeholder="Password"
            onChange={this.handleInputChange}
            autoComplete="current-password"
          />
          <br />
          <input
            type="password"
            className="field"
            id="passRepeat"
            placeholder="Repeat Password"
            onChange={this.handlePasswordChange}
          />
          <p className="errormsg" id="password-error-1">
            {() => {
              return this.isValidPassword ? "" : "Passwords must match";
            }}
          </p>
          <div className="formButtons">
            <button onClick={this.signInUser} className="formBtn signIn">
              Sign In
            </button>
            <button onClick={this.createUser} className="formBtn createAccount">
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccount;
