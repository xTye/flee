import { Component, onMount, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { A } from "@solidjs/router";
import Login from "./Login";

export const [navbarHeight, setNavbarHeight] = createStore({ height: 0 });

const Navbar: Component = () => {
  let parent: any;
  const [loggedIn, setLoggedIn] = createSignal(false);

  onMount(() => {
    setNavbarHeight({ height: parent.getBoundingClientRect().height });
  });

  window.addEventListener("resize", () => {
    // TODO: Add a resize to height on change navbar height
  });

  return (
    <>
      <div
        ref={parent}
        class="sticky top-0 flex justify-between items-center h-32 text-text bg-purple px-12 z-[1000] select-none shadow-sm shadow-black"
      >
        <div class="flex items-center gap-4">
          <A href="/">
            <img class="h-16 w-16" src="/logo-edited.png" alt="Logo" />
          </A>
          <div class="text-3xl">The Wandering Eyes</div>
        </div>

        <div class="flex items-center h-full gap-12 text-xl">
          <A href="/" class="hover:text-yellow">
            Home
          </A>
          <A href="/characters" class="hover:text-yellow">
            Characters
          </A>
          <A href="/map" class="hover:text-yellow">
            Map
          </A>
          <A href="/calendar" class="hover:text-yellow">
            Calendar
          </A>
          <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn}>
            <div class="hover:text-yellow cursor-pointer">
              {loggedIn() ? (
                <A href="/dashboard" class="hover:text-yellow">
                  Dashbaord
                </A>
              ) : (
                "Login"
              )}
            </div>
          </Login>
        </div>
      </div>
    </>
  );
};

export default Navbar;
