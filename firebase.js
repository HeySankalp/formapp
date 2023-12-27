import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth"
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyBQVM_g349rjQe84QzOvuE8RAeO2-oZOYY",
//     authDomain: "reactnative-signal.firebaseapp.com",
//     projectId: "reactnative-signal",
//     storageBucket: "reactnative-signal.appspot.com",
//     messagingSenderId: "567253339221",
//     appId: "1:567253339221:web:2ef3cddeda88e33af118dc"
//   };

const firebaseConfig = {
  apiKey: "AIzaSyCKEwGIm_vCW4lrSXo7dynlTbOvI6bLu-k",
  authDomain: "evotech-bc2d8.firebaseapp.com",
  projectId: "evotech-bc2d8",
  storageBucket: "evotech-bc2d8.appspot.com",
  messagingSenderId: "686032856379",
  appId: "1:686032856379:web:e52183b8241900dd3c431e"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
const storage = getStorage(app, firebaseConfig.storageBucket)

export { db, auth, storage };