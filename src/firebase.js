import firebase from "firebase/app"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAOXwEvbeT4K3rapaQlMkNEgyJfpa7lHBY",
  authDomain: "todo-list-ea269.firebaseapp.com",
  projectId: "todo-list-ea269",
  storageBucket: "todo-list-ea269.appspot.com",
  messagingSenderId: "414327452285",
  appId: "1:414327452285:web:95eb30feceba54f6b13714",
  measurementId: "G-HYNND4H2KD"
};
   
  // Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;