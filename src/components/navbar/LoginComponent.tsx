import { Component, Show, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { useSession } from "../../auth";
import { clickOutside } from "../../utils/clickOutside";

import PanelComponent from "./PanelComponent";

const LoginComponent: Component = () => {
  const [session, actions] = useSession();

  let panelDiv = document.createElement("div") as HTMLDivElement;
  let img = document.createElement("img") as HTMLImageElement;

  const [panel, setPanel] = createSignal(false);

  const photoURL = session().user?.photoURL;
  const photo = photoURL ? photoURL : "/instance.PNG";

  if (session().status === "loading") <></>;

  onMount(() => {
    clickOutside(panelDiv, () => setPanel(false), img);
  });

  return (
    <>
      <Show when={session().user}>
        <div class="relative">
          <img
            ref={img}
            src={photo}
            referrerPolicy="no-referrer"
            alt="Profile image"
            class="w-12 h-12 rounded-full border-white hover:border-yellow border-2"
            onClick={() => setPanel(!panel())}
          />
          <div ref={panelDiv}>
            <Show when={panel()}>
              <PanelComponent>
                <div class="flex flex-col gap-2 text-black bg-white p-4 rounded-md shadow-md">
                  <A href="/dashboard" class="hover:text-yellow">
                    Dashboard
                  </A>
                  <div class="border-b-2 border-lightWhite"></div>
                  <div class="hover:text-yellow">
                    <button
                      onClick={() => {
                        actions.logout();
                      }}
                    >
                      Flee
                    </button>
                  </div>
                </div>
              </PanelComponent>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={!session().user}>
        <button class="hover:text-yellow" onClick={() => actions.login()}>
          Login
        </button>
      </Show>
    </>
  );
};

export default LoginComponent;
