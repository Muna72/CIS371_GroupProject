import * as firebase from "firebase";
import { firebaseConfig } from "./config";

firebase.initializeApp(firebaseConfig);
var rootRef = firebase.database().ref(); // ref() points to root node without arguement
var productsRef = rootRef.child("products");

productsRef.on("child_added", snapshot => {
  var product = snapshot.val();
  console.log(product.name);

  this.setState({
    products: snapshot.val()
  });
});
