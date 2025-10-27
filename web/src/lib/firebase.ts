import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuoSwiszZw72UVFIXnfccy0dXWre6k904",
  authDomain: "adamus-beneficiaries.firebaseapp.com",
  projectId: "adamus-beneficiaries",
  storageBucket: "adamus-beneficiaries.appspot.com",
  messagingSenderId: "175408638830",
  appId: "1:175408638830:web:17ef930dc63374e1d46f7f",
  measurementId: "G-RS1VMS97W5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
