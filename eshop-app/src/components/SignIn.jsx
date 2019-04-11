import React, { Component } from "react";
import { Redirect } from "react-router";
import * as firebase from "firebase";

var userEmail = "";
var userPassword = "";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      redirect: false,
      redirect_createAcc: false
    };

    this.signInUser = this.signInUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleInputChange(event) {
    this.setState({ email: event.target.value }, function() {
      userEmail = this.state.email;
    });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value }, function() {
      userPassword = this.state.password;
    });
  }

  signInUser = e => {
    e.preventDefault();
    const auth = firebase.auth();
    var email = this.state.email;
    var pass = this.state.password;

    console.log("Email: " + userEmail);
    console.log("Password: " + userPassword);

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));

    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        // redirect to new page and update nav
        console.log(firebaseUser);
        if (this._isMounted) {
          this.setState({ redirect: true });
        }
      }
    });
  };

  createUser = e => {
    e.preventDefault();
    this.setState({ redirect_createAcc: true });
  };

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          push
          to={{
            pathname: "/",
            state: {
              user: this.state.user,
              loggedIn: true
            }
          }}
        />
      );
    }

    if (this.state.redirect_createAcc) {
      return (
        <Redirect
          push
          to={{
            pathname: "/CreateAccount/",
            state: { email: this.state.email, password: this.state.password }
          }}
        />
      );
    }

    return (
      <div className="main">
        <div className="sign-up-container">
          <form>
            <input
              type="email"
              className="field"
              id="email"
              defaultValue={this.state.email}
              placeholder="Email"
              onChange={this.handleInputChange}
              autoComplete="email"
            />
            <p className="errormsg" id="email_error_1">
              {this.state.error}
            </p>
            <input
              type="password"
              className="field"
              id="password"
              defaultValue={this.state.password}
              placeholder="Password"
              onChange={this.handlePasswordChange}
              autoComplete="current-password"
            />
            <p className="errormsg" id="password_error_1">
              {this.state.error}
            </p>
            <div className="formButtons">
              <button onClick={this.signInUser} className="formBtn signIn">
                Sign In
              </button>
              <button
                onClick={this.createUser}
                className="formBtn createAccount"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SignIn;
