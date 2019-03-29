import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import * as firebase from "firebase";
import { firebaseConfig } from "../config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var isLoggedIn = false;

function authUser() {
  return new Promise(function(resolve, reject) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        isLoggedIn = true;
        resolve(user);
      } else {
        isLoggedIn = false;
        reject("User not logged in");
      }
    });
  });
}

var searching = false;

const Search = () => {
  return (
    <div className="searchResults" id="searchResults">
      <ul>
        <li>
          Search not found.
          <br />
          <sub>Try another search term.</sub>
        </li>
      </ul>
    </div>
  );
};

const LoggedInNav = () => {
  console.log("Nav logged: " + isLoggedIn);
  if (isLoggedIn) {
    return (
      <div>
        <li>
          <NavLink to="/Cart/">Cart</NavLink>
        </li>
        <li>
          <NavLink to="/Account/">Account</NavLink>
        </li>
      </div>
    );
  } else {
    return (
      <div>
        <li>
          <NavLink to="/SignIn/">Sign In</NavLink>
        </li>
      </div>
    );
  }
};

class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticating: false,
      loggedIn: isLoggedIn
    };
  }

  componentDidMount() {
    authUser().then(
      user => {
        this.setState({ isAuthenticating: false });
      },
      error => {
        this.setState({ isAuthenticating: false });
      }
    );
  }

  render() {
    if (this.state.isAuthenticating) return null;

    console.log("logged in state: " + this.state.loggedIn);

    return (
      <nav>
        <ul>
          <li>
            <NavLink to="/">
              <img
                src="https://github.com/Muna72/CIS371_GroupProject/blob/master/eshop-app/src/img/amazoff.gif?raw=true"
                alt="logo"
                id="logo"
              />
            </NavLink>
          </li>
          <input
            type="text"
            className="search"
            onFocus={Search}
            placeholder="Search..."
          />

          <div className="menuItems">
            <LoggedInNav />
          </div>
        </ul>
        {searching ? <Search /> : null}
      </nav>
    );
  }
}

export default Navigation;
