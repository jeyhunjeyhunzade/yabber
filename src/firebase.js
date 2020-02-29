import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyCnaqGr0fTc9caaWOoB1sJe1wwvMgZ6Es4",
  authDomain: "love-chat-72fed.firebaseapp.com",
  databaseURL: "https://love-chat-72fed.firebaseio.com",
  projectId: "love-chat-72fed",
  storageBucket: "love-chat-72fed.appspot.com",
  messagingSenderId: "822534105877",
  appId: "1:822534105877:web:25d6ee1bf063d96293571c",
  measurementId: "G-0EW9RRYY7M"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase;
