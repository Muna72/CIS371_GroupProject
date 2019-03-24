import firebase from "firebase";

var config = {
  apiKey: "AIzaSyCB00wchyxzKiAuC7zD10eS0WSrXEQLVbU",
  authDomain: "cis371semesterproject.firebaseapp.com",
  databaseURL: "https://cis371semesterproject.firebaseio.com",
  projectId: "cis371semesterproject",
  storageBucket: "cis371semesterproject.appspot.com",
  messagingSenderId: "54214005334"
};

firebase.initializeApp(config);

function Firebase() {
  return <React>Firebase</React>;
}

export default Firebase;
