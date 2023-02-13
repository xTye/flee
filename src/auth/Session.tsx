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
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseStore } from "..";
import { SessionContext } from ".";

export interface SessionState {
  status: "loading" | "unauthenticated" | "authenticated";
  token?: string;
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
      setState({ ...state(), isLoading: true });
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      const admin = localStorage.getItem("admin") ? true : undefined;

      if (!userString) {
        setState({ ...state(), status: "unauthenticated" });
        return;
      }

      const user = JSON.parse(userString);

      if (!token || !user) {
        setState({ ...state(), status: "unauthenticated" });
        return;
      }

      setState({ token, user, status: "authenticated", admin });
    },

    login: async () => {
      localStorage.setItem("redirect", "true");
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      await setPersistence(auth, browserLocalPersistence);

      signInWithRedirect(auth, provider);
    },

    logout: async () => {
      setState({ ...state(), isLoading: true });
      let auth = getAuth();
      await signOut(auth);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      localStorage.removeItem("redirect");
      setState({
        token: undefined,
        user: undefined,
        status: "unauthenticated",
      });
    },

    redirect: async () => {
      let auth = getAuth();

      try {
        const result = await getRedirectResult(auth);

        if (!result) return;
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) return undefined;
        const user = result.user;
        const token = await user.getIdToken();
        let admin: boolean | undefined = undefined;

        console.log(credential);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        const res = await getDocs(
          query(
            collection(firebaseStore, "admins"),
            where("email", "==", user.email)
          )
        );

        res.forEach(() => (admin = true));

        if (admin) localStorage.setItem("admin", "true");

        setState({ status: "authenticated", token, user, admin });
      } catch (error: any) {
        console.log(error);
      }

      localStorage.removeItem("redirect");
    },
  };

  if (localStorage.getItem("redirect") === "true") {
    console.log("redirecting");
    actions.redirect();
  } else {
    console.log("initializing");
    actions.init();
  }

  const session = state;

  return (
    <SessionContext.Provider value={[session, actions]}>
      {props.children}
    </SessionContext.Provider>
  );
};
