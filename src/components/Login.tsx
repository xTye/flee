import { Component } from "solid-js";
import { useSession } from "../auth/Session";

const Login: Component = () => {
  const { session, actions } = useSession();

  if (session().status === "loading") <div>Loading...</div>;

  return (
    <>
      <button
        onClick={() => {
          session().user ? actions.logout() : actions.login();
        }}
      >
        {session().user ? "Flee" : "Login"}
      </button>
    </>
  );
};

export default Login;
