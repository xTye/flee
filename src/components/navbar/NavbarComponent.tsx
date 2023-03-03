import { Component, Show, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A } from "@solidjs/router";
import LoginComponent from "./LoginComponent";
import PageLinkComponent from "./PageLinkComponent";

export const [navbarHeight, setNavbarHeight] = createStore({ height: 0 });

const NavbarComponent: Component = () => {
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
