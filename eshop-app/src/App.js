import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import Navigation from "./components/Navigation";
import Shop from "./components/Shop";
import Account from "./components/Account";
import Orders from "./components/Orders";
import SignIn from "./components/SignIn";
import CreateAccount from "./components/CreateAccount";
import Cart from "./components/Cart";
import Product from "./components/Product";
import Error from "./components/Error";

import "./index.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <Switch>
            <Route path="/" exact component={Shop} />
            <Route path="/Cart/" component={Cart} />
            <Route path="/Account/" component={Account} />
            <Route path="/Orders/" component={Orders} />
            <Route path="/SignIn/" component={SignIn} />
            <Route path="/CreateAccount/" component={CreateAccount} />
            <Route path="/Product/:key" component={Product} />
            <Route component={Error} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
