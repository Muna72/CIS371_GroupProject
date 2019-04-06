import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import * as firebase from "firebase";
import { firebaseConfig } from "../config";
import { withRouter } from "react-router-dom";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// remove global, update state (render invoked auto)

var searching = false;

const SearchBar = () => {
  return (
    <input
      type="text"
      className="search"
      onFocus={Search}
      placeholder="Search..."
    />
  );
};

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

class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false
    };
  }

  //fix me
  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          // fix me
          this.setState({ loggedIn: true });
        } else {
          this.setState({ loggedIn: false });
        }
      }.bind(this)
    );
  }

  // functional comppnenet are stateless, inherit from
  // use if statements inside render to check state variables
  //logged in nav

  render() {
    console.log("logged in state: " + this.state.loggedIn);

    if (this.state.loggedIn && this.props.location.pathname === "/") {
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
            <SearchBar />

            <div className="menuItems">
              <div>
                <li>
                  <NavLink to="/Cart/">Cart</NavLink>
                </li>
                <li>
                  <NavLink to="/Account/">Account</NavLink>
                </li>
              </div>
            </div>
          </ul>
          {searching ? <Search /> : null}
        </nav>
      );
    }

    if (this.state.loggedIn && this.props.location.pathname !== "/") {
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

            <div className="menuItems">
              <div>
                <li>
                  <NavLink to="/Cart/">Cart</NavLink>
                </li>
                <li>
                  <NavLink to="/Account/">Account</NavLink>
                </li>
              </div>
            </div>
          </ul>
          {searching ? <Search /> : null}
        </nav>
      );
    }

    if (!this.state.loggedIn && this.props.location.pathname === "/") {
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
            <SearchBar />

            <div className="menuItems">
              <div>
                <li>
                  <NavLink to="/SignUp/">Sign Up</NavLink>
                </li>
                <li>
                  <NavLink to="/SignIn/">Sign In</NavLink>
                </li>
              </div>
            </div>
          </ul>
          {searching ? <Search /> : null}
        </nav>
      );
    }

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

          <div className="menuItems">
            <div>
              <li>
                <NavLink to="/SignIn/">Sign In</NavLink>
              </li>
            </div>
          </div>
        </ul>
        {searching ? <Search /> : null}
      </nav>
    );
  }
}

export default withRouter(Navigation);
