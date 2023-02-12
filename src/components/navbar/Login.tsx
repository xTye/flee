import { Component, Show, createSignal, onMount } from "solid-js";
import { useSession } from "../../auth";
import { clickOutside } from "../../utils/clickOutside";

import Panel from "./Panel";

const Login: Component = () => {
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
              <Panel>
                <div></div>
              </Panel>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={!session().user}>
        <button onClick={() => actions.login()}></button>
      </Show>
    </>
  );
};

export default Login;
