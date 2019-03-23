import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";

function Index() {
  return (
    <div className="main">
      <h2>Home</h2>
    </div>
  );
}

function Shop() {
  return (
    <div className="main">
      <h2>Shop</h2>
    </div>
  );
}

function Account() {
  return (
    <div className="main">
      <h2>Account</h2>
      <div id="firebaseui-auth-container" />
      <div id="loader">Loading...</div>
    </div>
  );
}

function Search() {}

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">
                <img
                  src="https://github.com/Muna72/CIS371_GroupProject/blob/master/eshop-app/src/img/amazoff.gif?raw=true"
                  alt="logo"
                  id="logo"
                />
              </Link>
            </li>
            <input
              type="text"
              className="search"
              onChange={Search}
              placeholder="Search..."
            />

            <div className="menuItems">
              <li>
                <Link to="/Shop/">Shop</Link>
              </li>
              <li>
                <Link to="/Account/">Account</Link>
              </li>
            </div>
          </ul>
        </nav>

        <div className="searchResults" id="searchResults">
          <ul>
            <li>
              Search not found.
              <br />
              <sub>Try another search term.</sub>
            </li>
          </ul>
        </div>

        <Route path="/" exact component={Index} />
        <Route path="/Shop/" component={Shop} />
        <Route path="/Account/" component={Account} />
      </div>
    </Router>
  );
}

export default AppRouter;
