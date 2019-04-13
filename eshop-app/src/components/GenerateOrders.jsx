import React, { Component } from "react";
import * as firebase from "firebase";
import CurrencyFormat from "react-currency-format";

var accountOrders = [];
var orders = null;

class GenerateOrders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            orders: []
        };
    }

    getCurrentUser = () => {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                this.setState({
                    user: firebase.auth().currentUser
                });
            }
        });
    };

    handleOnClick = () => {
        // some action...
        // then redirect
        this.setState({ redirect: true });
    };

    // called after rendered to DOM
    componentDidMount() {

        this._isMounted = true;

        if (this._isMounted) {
            this.getCurrentUser();
        }

        // set up listeners and download data to be rendered to DOM
        const rootRef = firebase.database().ref();
        const ordersRef = rootRef.child("customers").child(this.state.user.uid).child("orders");

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
        orders = accountOrders.map(order => (
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
