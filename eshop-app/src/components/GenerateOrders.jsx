import React, { Component } from "react";
import * as firebase from "firebase";
import CurrencyFormat from "react-currency-format";

var accountOrders = [];

class GenerateOrders extends Component {
    constructor() {
        super();
        this.state = {
            orders: []
        };
    }

    // called after rendered to DOM
    componentDidMount() {
        // set up listeners and download data to be rendered to DOM
        const rootRef = firebase.database().ref(); // ref() points to root node without arguement
        const ordersRef = rootRef.child("customers").orderByChild('email').equalTo(emailValue); //TODO need emailValue

        this.setState({
            orders: null
        });

        accountOrders = [];

        ordersRef.on("child_added", snapshot => {
            var order = snapshot.val();

            if (accountOrders.length > 0) {
                accountOrders.push(order);
            }

            this.setState({
                orders: accountOrders
            });
        });
    }

    render() {
        accountOrders.map(order => (
            <div className="accountOrder">
                <div className="orderDetails">
                    <p>
                        <b>Purchase Order on {order.date}</b>
                    </p>
                    <ul style="list-style-type:none;">
                        Object.keys({order.productsInOrder}).map(product, key => (
                        return '<li>' + product + product[key] + '</li>';
                        ));
                    </ul>
                    <CurrencyFormat
                        value={order.totalPrice}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={value => <div>{value}</div>}
                    />
                </div>
            </div>
        ));

        return <div>{orders}</div>;
    }
}

export default GenerateOrders;
