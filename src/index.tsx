/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyASrzGbTJs9bJwzcLasfpOW1nbq7ymfsyE",
  authDomain: "fleednd.com",
  projectId: "flee-website",
  storageBucket: "flee-website.appspot.com",
  messagingSenderId: "796176359929",
  appId: "1:796176359929:web:178bad7743e9c3cfa15d28",
  measurementId: "G-W43GXRPJ4Q",
  databaseURL: "https://flee-website-default-rtdb.firebaseio.com",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseStore = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export const firebaseDatabase = getDatabase(firebaseApp);
export const firebaseFunctions = getFunctions(firebaseApp);

if (false && import.meta.env.MODE === "development")
  connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?"
  );
}

render(() => <App />, root!);
