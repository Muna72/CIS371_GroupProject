import React, { Component } from "react";

const GenerateResult = () => {
    return (
        <tr>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        </tr>
    );
};

class Orders extends Component {
    render() {
        return (
            <div className="main">
                <h2>Shopping Cart</h2>
                <button className="checkoutBtn">Proceed to Checkout</button>
                <table>
                    <tbody>
                    <tr>
                        <th>Image</th>
                        <th>Item Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                    <GenerateResult />
                    </tbody>
                </table>
                <button className="checkoutBtn emptyCartBtn">Empty Cart</button>
            </div>
        );
    }
}

export default Cart;
