import { Component, Show, createSignal } from "solid-js";
import { useSession } from "../../auth";
import { clickOutside } from "../../utils/clickOutside";

import Panel from "./Panel";

const Login: Component = () => {
  const [session, actions] = useSession();

  let panelDiv = document.createElement("div") as HTMLDivElement;

  const [panel, setPanel] = createSignal(false);
  const event = clickOutside(panelDiv, () => setPanel(false));

  const photoURL = session().user?.photoURL;
  const photo = photoURL ? photoURL : "/instance.PNG";

  if (session().status === "loading") <></>;

  return (
    <>
      <Show when={session().user}>
        <div class="relative">
          <img
            src={photo}
            referrerPolicy="no-referrer"
            alt="Profile image"
            class="w-12 h-12 rounded-full border-white hover:border-yellow border-2"
            onClick={() => {
              if (!panel()) setPanel(true);
            }}
          />
          <Show when={panel()}>
            <div ref={panelDiv}>
              <Panel>Tset</Panel>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={!session().user}>
        <button onClick={() => actions.login()}></button>
      </Show>
    </>
  );
};

export default Login;
