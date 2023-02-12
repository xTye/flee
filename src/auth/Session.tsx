import {
  createSignal,
  Accessor,
  useContext,
  createContext,
  JSX,
  Component,
  Context,
} from "solid-js";
import {
  GoogleAuthProvider,
  User,
  getAuth,
  getRedirectResult,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

export interface SessionState {
  status: "loading" | "unauthenticated" | "authenticated";
  token: string | undefined;
  user: User | undefined;
}

export interface SessionActions {
  init: () => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  redirect: () => Promise<void>;
}

export type SessionStore = {
  session: Accessor<SessionState>;
  actions: SessionActions;
};

const SessionContext = createContext<SessionStore>() as Context<SessionStore>;

interface SessionProviderProps {
  children: JSX.Element;
}

export const SessionProvider: Component<SessionProviderProps> = (props) => {
  const [state, setState] = createSignal<SessionState>({
    status: "loading",
    token: undefined,
    user: undefined,
  });

  const actions: SessionActions = {
    init: () => {
      setState({ ...state(), isLoading: true });
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      if (!userString) {
        setState({ ...state(), status: "unauthenticated" });
        return;
      }

      const user = JSON.parse(userString);

      if (!token || !user) {
        setState({ ...state(), status: "unauthenticated" });
        return;
      }

      setState({ token, user, status: "authenticated" });
    },

    login: async () => {
      localStorage.setItem("redirect", "true");
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      signInWithRedirect(auth, provider);
    },

    logout: async () => {
      setState({ ...state(), isLoading: true });
      let auth = getAuth();
      await signOut(auth);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
        if (credential) {
        } else return undefined;
        const user = result.user;
        const token = await user.getIdToken();

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setState({ ...state(), token, user });
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

  return (
    <SessionContext.Provider value={{ session: state, actions }}>
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
