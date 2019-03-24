import React from "react";
import { NavLink } from "react-router-dom";

var isLoggedIn = true;
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
  if (isLoggedIn) {
    return (
      <li>
        <NavLink to="/Cart/">Cart</NavLink>
      </li>
    );
  }

  return null;
};

const Navigation = () => {
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
          <li>
            <NavLink to="/Account/">Account</NavLink>
          </li>
        </div>
      </ul>
      {searching ? <Search /> : null}
    </nav>
  );
};

export default Navigation;
