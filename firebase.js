// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxNgVIpcf-imv_MmRbz7bmbbaA5BrBBYo",
  authDomain: "chatapp-a1d56.firebaseapp.com",
  projectId: "chatapp-a1d56",
  storageBucket: "chatapp-a1d56.appspot.com",
  messagingSenderId: "129139093907",
  appId: "1:129139093907:web:d562a6a440028670a17866",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export { auth };

const firestore = firebase.default.firestore();

export { firestore };
