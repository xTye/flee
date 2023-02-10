import {
  GoogleAuthProvider,
  signInWithRedirect,
  getAuth,
  getRedirectResult,
  signOut,
} from "firebase/auth";
import { Component, onMount, createSignal, Setter, Accessor } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

const Login: Component<{
  children?: JSX.Element;
  loggedIn: Accessor<boolean>;
  setLoggedIn: Setter<boolean>;
}> = ({ children, loggedIn, setLoggedIn }) => {
  let provider = new GoogleAuthProvider();
  let auth = getAuth();

  const login = async () => {
    signInWithRedirect(auth, provider);
  };
  const so = async () => {
    signOut(auth).then(() => {
      setLoggedIn(false);
    });
  };

  onMount(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (!result) return;
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) setLoggedIn(true);
        else return;
        const token = credential.accessToken;
        const user = result.user;
        console.log(token, user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  });

  return (
    <>
      <button
        onClick={() => {
          loggedIn() ? so() : login();
        }}
      >
        {children}
      </button>
    </>
  );
};

export default Login;
