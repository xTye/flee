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
import {
  set as setCookie,
  get as getCookie,
  erase as eraseCookie,
} from "browser-cookies";

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
      const userString = getCookie("user");
      const admin = getCookie("admin") ? true : undefined;

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
      setCookie("redirect", "true", { samesite: "Lax" });
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      await setPersistence(auth, browserLocalPersistence);

      signInWithRedirect(auth, provider);
    },

    logout: async () => {
      const auth = state().auth;
      if (!auth) return;

      await signOut(auth);

      eraseCookie("user");
      eraseCookie("admin");
      eraseCookie("redirect");
      setState({
        auth: undefined,
        user: undefined,
        status: "unauthenticated",
      });
    },

    redirect: async () => {
      console.log("lkejresjlfSJLEFLSKEFljkSEF");
      const auth = getAuth();

      try {
        const result = await getRedirectResult(auth);
        if (!result) throw new Error("No redirect result");

        const user = result.user;
        let admin: boolean | undefined = undefined;

        setCookie("user", JSON.stringify(user), { samesite: "Lax" });

        const adminRes = await getDoc(doc(firebaseStore, "admins", user.uid));

        adminRes.exists() ? (admin = true) : (admin = false);
        if (admin) setCookie("admin", "true", { samesite: "Lax" });

        setState({ status: "authenticated", auth, user, admin });

        const userRes = await getDoc(doc(firebaseStore, "users", user.uid));
        if (!userRes.exists()) await useCreateUser(user.uid);
      } catch (error: any) {
        setState({ status: "unauthenticated" });
        console.log(error);
      }

      eraseCookie("redirect");
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

      setCookie("user", JSON.stringify(userRes), { samesite: "Lax" });

      setState({ ...state(), auth, user: userRes });
    },
  };

  if (getCookie("redirect") === "true") actions.redirect();
  else actions.init();

  const session = state;

  return (
    <SessionContext.Provider value={[session, actions]}>
      {props.children}
    </SessionContext.Provider>
  );
};
