import type { Component } from "solid-js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Login: Component = () => {
  return (
    <div class="min-h-screen bg-background text-text text-justify pt-1 pl-3">
      <div class="text-xl">This is the login page.</div>
      <div class="text-xl">Google Button</div>
    </div>
  );
};

export default Login;
