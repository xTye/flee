import { Component, onMount, createMemo, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import { useSession } from "../auth";

const DashboardPage: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  let docsDiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;

  if (session().status === "loading") return <div>Loading</div>;

  if (session().status === "unauthenticated") {
    navigate("/", { replace: true });
    return <div>Not logged in</div>;
  }

  createMemo(() => {
    docsDiv.style.height = window.innerHeight - navbarHeight.height + "px";
  });

  return (
    <>
      <div
        ref={docsDiv}
        class="flex flex-col gap-6 min-h-screen bg-background text-text py-12"
      >
        <div class="text-text text-4xl px-40">Player Dashboard</div>
        <div class="flex justify-between gap-2">
          <embed
            src="https://docs.google.com/document/d/1IlCK-w6unVGRH0dPMZ97MyuksUQsAazfPhOwgFjsX50/edit?embedded=true"
            class="h-screen basis-1/2 h-[600px]"
          ></embed>
          <embed
            src="https://docs.google.com/spreadsheets/d/1sZkFUeiAcg6ZmkJ1JfVq21pKyilsHa3yI2M0BeTauRo/edit#gid=0?embedded=true"
            class="h-screen basis-1/2 h-[600px]"
          ></embed>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
