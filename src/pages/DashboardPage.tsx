import { Component, createMemo, createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import { useSession } from "../auth";
import { UserInterface } from "../types/UserType";
import { useFetchUser } from "../services/UserService";

const DashboardPage: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  let docsDiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;

  const [user, setUser] = createSignal<UserInterface>();

  if (session().status === "loading") return <div>Loading</div>;

  if (session().status === "unauthenticated") {
    navigate("/", { replace: true });
    return <div>Not logged in</div>;
  }

  createMemo(() => {
    docsDiv.style.height = window.innerHeight - navbarHeight.height + "px";
  });

  onMount(async () => {
    const id = session().user?.uid || undefined;
    if (!id) return navigate("/");

    const user = await useFetchUser(id);
    setUser(user);
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
            class="basis-1/2 h-[600px]"
          ></embed>
          <embed
            src="https://docs.google.com/spreadsheets/d/1sZkFUeiAcg6ZmkJ1JfVq21pKyilsHa3yI2M0BeTauRo/edit#gid=0?embedded=true"
            class="basis-1/2 h-[600px]"
          ></embed>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
