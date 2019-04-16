import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import * as firebase from "firebase";
import { firebaseConfig } from "../config";
import { withRouter } from "react-router-dom";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var searching = false;
var user;

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
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      loggedIn: false
    };
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    this.setState({ user: user });
  };

  componentDidMount() {
    this._isMounted = true;

    if ((this._isMounted = true)) {
      firebase.auth().onAuthStateChanged(
        function(firebaseUser) {
          user = firebaseUser;
          if (user) {
            this.setState({ user: user, loggedIn: true });
          } else {
            this.setState({ loggedIn: false });
          }
        }.bind(this)
      );
    }
  }

  // rerenders on every click inside the nav

  render() {
    //console.log("logged in state: " + this.state.loggedIn);

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
