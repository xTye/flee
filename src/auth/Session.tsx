import { createSignal, JSX, Component } from "solid-js";
import {
  GoogleAuthProvider,
  User,
  getAuth,
  getRedirectResult,
  setPersistence,
  signInWithRedirect,
  browserLocalPersistence,
  signOut,
  Auth,
} from "firebase/auth";
import { collection, doc, getDoc, query, where } from "firebase/firestore";
import { firebaseStore } from "..";
import { SessionContext } from ".";

export interface SessionState {
  status: "loading" | "unauthenticated" | "authenticated";
  auth?: Auth;
  user?: User;
  admin?: boolean;
}

export interface SessionActions {
  init: () => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  redirect: () => Promise<void>;
}

interface SessionProviderProps {
  children: JSX.Element;
}

export const SessionProvider: Component<SessionProviderProps> = (props) => {
  const [state, setState] = createSignal<SessionState>({
    status: "loading",
  });

  const actions: SessionActions = {
    init: () => {
      const auth = getAuth();
      setState({ ...state(), isLoading: true });
      const userString = localStorage.getItem("user");
      const admin = localStorage.getItem("admin") ? true : undefined;

      if (!userString) {
        setState({ ...state(), status: "unauthenticated" });
        return;
      }

      const user = JSON.parse(userString);

      if (!user) {
        setState({ ...state(), status: "unauthenticated" });
        return;
      }

      setState({ status: "authenticated", auth, user, admin });
    },

    login: async () => {
      localStorage.setItem("redirect", "true");
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      await setPersistence(auth, browserLocalPersistence);

      signInWithRedirect(auth, provider);
    },

    logout: async () => {
      const auth = state().auth;
      if (!auth) return;

      await signOut(auth);

      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      localStorage.removeItem("redirect");
      setState({
        auth: undefined,
        user: undefined,
        status: "unauthenticated",
      });
    },

    redirect: async () => {
      const auth = getAuth();

      try {
        const result = await getRedirectResult(auth);
        if (!result) return;

        const user = result.user;
        let admin: boolean | undefined = undefined;

        localStorage.setItem("user", JSON.stringify(user));

        const res = await getDoc(doc(firebaseStore, "admins", user.uid));

        res.exists() ? (admin = true) : (admin = false);
        if (admin) localStorage.setItem("admin", "true");

        setState({ status: "authenticated", auth, user, admin });
      } catch (error: any) {
        console.log(error);
      }

      localStorage.removeItem("redirect");
    },
  };

  if (localStorage.getItem("redirect") === "true") actions.redirect();
  else actions.init();

  const session = state;

  return (
    <SessionContext.Provider value={[session, actions]}>
      {props.children}
    </SessionContext.Provider>
  );
};
