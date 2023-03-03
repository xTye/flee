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
  updateProfile,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseStore } from "..";
import { SessionContext } from ".";
import { useCreateUser } from "../services/UserService";
import { UserInterface } from "../types/UserType";

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
  update: (user: UserInterface) => Promise<void>;
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

        const adminRes = await getDoc(doc(firebaseStore, "admins", user.uid));

        adminRes.exists() ? (admin = true) : (admin = false);
        if (admin) localStorage.setItem("admin", "true");

        setState({ status: "authenticated", auth, user, admin });

        const userRes = await getDoc(doc(firebaseStore, "users", user.uid));
        if (!userRes) await useCreateUser(user.uid);
      } catch (error: any) {
        console.log(error);
      }

      localStorage.removeItem("redirect");
    },

    update: async (user: UserInterface) => {
      let auth = getAuth();

      if (!auth.currentUser) return;

      await updateProfile(auth.currentUser, {
        displayName: user.name,
        photoURL: user.picture,
      });

      auth = getAuth();
      const userRes = auth.currentUser;

      if (!userRes) throw new Error("User not found");

      localStorage.setItem("user", JSON.stringify(userRes));

      setState({ ...state(), auth, user: userRes });
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
