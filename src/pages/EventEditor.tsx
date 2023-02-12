import { Component, onMount } from "solid-js";
import { useSession } from "../auth/Session";

const EventEditor: Component = () => {
  const { session, actions } = useSession();

  if (session().status === "loading") <div>Loading</div>;

  return (
    <>
      <div class="min-h-screen bg-background text-text">
        Test {session().user ? "Logged in" : "Not logged in"}
      </div>
    </>
  );
};

export default EventEditor;
