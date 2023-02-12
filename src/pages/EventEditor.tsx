import { Component } from "solid-js";
import { useSession } from "../auth";
import { useNavigate } from "@solidjs/router";

const EventEditor: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();

  if (session().status === "loading") <div>Loading</div>;

  if (session().status === "unauthenticated") <div>Not logged in</div>;

  if (!session().admin) {
    <div>Not admin</div>;
    navigate("/", { replace: true });
  }

  return (
    <>
      <div class="min-h-screen bg-background text-text">
        Test {session().user ? "Logged in" : "Not logged in"}
      </div>
    </>
  );
};

export default EventEditor;
