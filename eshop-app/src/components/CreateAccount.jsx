import React, { Component } from "react";
import { Redirect } from "react-router";
import * as firebase from "firebase";

var userEmail = "";
var userPassword = "";
var userRepeatPassword = "";

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordRepeat: "",
      redirect: false,
      errorMsg: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(
      this
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.setState({
        email: this.props.location.state.email,
        password: this.props.location.state.password
      });
    }
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

  handleRepeatPasswordChange(event) {
    this.setState({ passwordRepeat: event.target.value }, function() {
      userRepeatPassword = this.state.passwordRepeat;
    });
  }

  // creates a customer account for them using their unique user id
  // this can hold their cart, orders, info, etc.
  writeUserData(user) {
    firebase
      .database()
      .ref("customers/" + user.uid)
      .set({
        email: user.email,
        name: "",
        shippingAddress: {
          streetAddress: "",
          city: "",
          state: "",
          zip: "",
          country: ""
        },
        orders: []
      });
  }

  createUser = e => {
    e.preventDefault();

    var email = this.state.email;
    var pass = this.state.password;
    var repeatPass = this.state.passwordRepeat;

    console.log("Email: " + userEmail);
    console.log("Password: " + userPassword);
    console.log("Repeat Password: " + userRepeatPassword);

    // reset error message
    this.setState({ errorMsg: "" });

    if (email === "" || pass === "" || repeatPass === "") {
      this.setState({ errorMsg: "Please fill all fields." });
    } else if (pass !== repeatPass) {
      this.setState({ errorMsg: "Passwords do not match." });
    } else {
      const that = this;

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, pass)
        .catch(function(error) {
          // Handle Errors here.
          that.setState({ errorMsg: error.message });
          // ...
        });

      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          user = firebase.auth().currentUser;

          // save a space for them in the realtime database
          this.writeUserData(user);
        }
      });

      firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          console.log(firebaseUser);
          if (this._isMounted) {
            this.setState({ redirect: true });
          }
        }
      });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/Account/" />;
    }

    // if an error message is present
    if (this.state.errorMsg) {
      return (
        <div className="main">
          <div className="sign-up-container">
            <form>
              <input
                type="email"
                className="field"
                id="email"
                defaultValue={this.props.location.state.email}
                placeholder="Email"
                onChange={this.handleInputChange}
                autoComplete="email"
              />
              <p className="errormsg" id="email_error_1" />
              <input
                type="password"
                className="field"
                id="password"
                defaultValue={this.props.location.state.password}
                placeholder="Password"
                onChange={this.handlePasswordChange}
                autoComplete="current-password"
              />
              <p className="errormsg" id="password_error_1" />
              <input
                type="password"
                className="field"
                id="repeat_password"
                defaultValue=""
                placeholder="Repeat Password"
                onChange={this.handleRepeatPasswordChange}
                autoComplete="current-password"
              />
              <p className="errormsg" id="password_error_1">
                {this.state.errorMsg}
              </p>
              <div className="formButtons">
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

    return (
      <div className="main">
        <div className="sign-up-container">
          <form>
            <input
              type="email"
              className="field"
              id="email"
              defaultValue={this.props.location.state.email}
              placeholder="Email"
              onChange={this.handleInputChange}
              autoComplete="email"
            />
            <p className="errormsg" id="email_error_1" />
            <input
              type="password"
              className="field"
              id="password"
              defaultValue={this.props.location.state.password}
              placeholder="Password"
              onChange={this.handlePasswordChange}
              autoComplete="current-password"
            />
            <p className="errormsg" id="password_error_1" />
            <input
              type="password"
              className="field"
              id="repeat_password"
              defaultValue=""
              placeholder="Repeat Password"
              onChange={this.handleRepeatPasswordChange}
              autoComplete="current-password"
            />
            <p className="errormsg" id="password_error_1">
              <br />
            </p>
            <div className="formButtons">
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

export default CreateAccount;
