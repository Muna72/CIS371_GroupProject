import React, { Component } from 'react';
import { Redirect } from "react-router";
import * as firebase from "firebase";

class CreateAccount extends Component {
    constructor() {
        super();
        this.state = {
          email: "",
          password: "",
          passRepeat: "",
          redirect: false
        };

        this.signInUser = this.signInUser.bind(this);
        this.createUser = this.createUser.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    componentWillUnmount() {
        this._isMounted = false;
      }
    
    handleInputChange(event) {
        this.setState({ email: event.target.value }, function() {
            //userEmail = this.state.email;
        });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value }, function() {
            //userPassword = this.state.password;
        });
    }

    signUpUser = e => {
        e.preventDefault();
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
    return <div className="main">
        <h1>Sign Up</h1>
        <div className="sign-up-container">
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
            <input
              type="password"
              className="field"
              id="passRepeat"
              defaultValue={this.state.passRepeat}
              placeholder="Repeat Password"
              onChange={this.handlePasswordChange}
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
        </div>        
      </div>
  }
}

export default CreateAccount;