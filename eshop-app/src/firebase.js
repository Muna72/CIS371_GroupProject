import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCB00wchyxzKiAuC7zD10eS0WSrXEQLVbU",
  authDomain: "cis371semesterproject.firebaseapp.com",
  databaseURL: "https://cis371semesterproject.firebaseio.com",
  projectId: "cis371semesterproject",
  storageBucket: "cis371semesterproject.appspot.com",
  messagingSenderId: "54214005334"
};

firebase.initializeApp(config);

export default firebase;
