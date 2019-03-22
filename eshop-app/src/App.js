import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";

function Index() {
  return <h2>Home</h2>;
}

function Shop() {
  return <h2>Shop</h2>;
}

function Account() {
  return <h2>Account</h2>;
}

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <div class="menuItems">
              <li>
                <Link to="/Shop/">Shop</Link>
              </li>
              <li>
                <Link to="/Account/">Account</Link>
              </li>
            </div>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/Shop/" component={Shop} />
        <Route path="/Account/" component={Account} />
      </div>
    </Router>
  );
}

export default AppRouter;
