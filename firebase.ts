import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2NpCJYpkMWK6wk47LEKInkR-nAu3lbh8",
  authDomain: "picvote-1150a.firebaseapp.com",
  projectId: "picvote-1150a",
  storageBucket: "picvote-1150a.appspot.com",
  messagingSenderId: "783966047062",
  appId: "1:783966047062:web:9ceac5aa3b208f81eb24f7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
