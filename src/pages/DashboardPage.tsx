import {
  Component,
  For,
  Show,
  createMemo,
  createSignal,
  onMount,
} from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import { useSession } from "../auth";
import { UserInterface } from "../types/UserType";
import { useCreateUser, useFetchUser } from "../services/UserService";

const DashboardPage: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  let docsDiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;

  const [user, setUser] = createSignal<UserInterface>();
  const [loading, setLoading] = createSignal<boolean>(true);

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

    setLoading(false);
  });

  return (
    <>
      <div
        ref={docsDiv}
        class="flex flex-col gap-6 min-h-screen h-screen bg-background text-text py-12"
      >
        <div class="flex self-center justify-between w-4/5">
          <div class="text-text text-4xl">
            Welcome{" "}
            {session()?.user?.displayName?.split(" ")[0]
              ? session()?.user?.displayName?.split(" ")[0]
              : "User"}
          </div>
          <Show when={!loading() && user()}>
            <div class="flex gap-4">
              <A
                href={`/user-editor/${session().user?.uid}`}
                class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
              >
                Edit Account
              </A>
              <A
                href="/teasers"
                class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
              >
                Teasers
              </A>
            </div>
          </Show>
          <Show when={!loading() && !user()}>
            <button
              onClick={async () => {
                try {
                  await useCreateUser(session()?.user?.uid || "");
                  const user = await useFetchUser(session()?.user?.uid || "");
                  setUser(user);
                } catch (e) {
                  console.error(e);
                }
              }}
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Create Account
            </button>
          </Show>
        </div>
        <div class="flex justify-between gap-2">
          <Show when={import.meta.env.MODE !== "development"}>
            <For each={user()?.tools}>
              {(tool) => (
                <iframe src={tool} class="basis-1/2 h-[700px]"></iframe>
              )}
            </For>
          </Show>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
