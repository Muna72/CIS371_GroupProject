import React, { Component } from "react";
import GenerateOrders from "./GenerateOrders";

/*const Orders = () => {
    return (
        <div className="main">
            <h2>Past Orders</h2>
            <GenerateOrders />
        </div>
    );
}; */

class Orders extends Component {
    render() {
        return (
            <div className="main">
                <h2>Past Orders</h2>
                <GenerateOrders />
            </div>
        );
    }
}

export default Orders;
