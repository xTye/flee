import { Component, Show, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A } from "@solidjs/router";
import LoginComponent from "./LoginComponent";
import PageLinkComponent from "./PageLinkComponent";
import { useSession } from "../../auth";

export const [navbarHeight, setNavbarHeight] = createStore({ height: 0 });

const NavbarComponent: Component = () => {
  const [session, actions] = useSession();
  let parent: any;

  const [width, setWidth] = createSignal(window.innerWidth);

  onMount(() => {
    setNavbarHeight({ height: parent.getBoundingClientRect().height });
  });

  const cb = () => {
    setWidth(window.innerWidth);
  };

  window.addEventListener("resize", cb);

  onCleanup(() => {
    window.removeEventListener("resize", cb);
  });

  return (
    <>
      <div
        ref={parent}
        class="sticky top-0 flex justify-between items-center h-20 text-text bg-purple px-12 z-[1000] select-none shadow-sm shadow-black"
      >
        <div class="flex items-center gap-4">
          <A href="/">
            <img
              class="h-16 w-16"
              src="/campaign-images/logo-edited.png"
              alt="Logo"
            />
          </A>
          <Show when={session().status === "authenticated"}>
            <A
              href="/live"
              class="flex items-center gap-2 hover:bg-lightPurple h-8 rounded-full px-4"
            >
              <div class="flex items-center justify-center relative">
                <div class="absolute w-3 h-3 bg-pink rounded-full"></div>
                <div class="absolut w-3 h-3 bg-pink rounded-full animate-ping"></div>
              </div>
              <div class="text-text text-lg">Live</div>
            </A>
          </Show>
        </div>

        <Show when={width() < 768}>
          <div class="cursor-pointer">
            <LoginComponent width={width} />
          </div>
        </Show>

        <Show when={width() >= 768}>
          <div class="flex items-center h-full gap-12 text-xl">
            <PageLinkComponent />
            <div class="cursor-pointer">
              <LoginComponent />
            </div>
          </div>
        </Show>
      </div>
    </>
  );
};

export default NavbarComponent;
