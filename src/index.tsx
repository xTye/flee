/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASrzGbTJs9bJwzcLasfpOW1nbq7ymfsyE",
  authDomain: "flee-website.firebaseapp.com",
  projectId: "flee-website",
  storageBucket: "flee-website.appspot.com",
  messagingSenderId: "796176359929",
  appId: "1:796176359929:web:178bad7743e9c3cfa15d28",
  measurementId: "G-W43GXRPJ4Q",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseStore = getFirestore();

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?"
  );
}

render(() => <App />, root!);
