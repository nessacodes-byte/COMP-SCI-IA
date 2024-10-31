// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpAsfymPQekkrDh8cF5vX7Tmy71r0_dwM",
  authDomain: "comp-sci-ia-62567.firebaseapp.com",
  projectId: "comp-sci-ia-62567",
  storageBucket: "comp-sci-ia-62567.appspot.com",
  messagingSenderId: "679346834115",
  appId: "1:679346834115:web:3fc988809f3362badbb076",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
