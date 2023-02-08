import type { Component } from "solid-js";
import { A } from "@solidjs/router";

const Navbar: Component = () => {
  return (
    <>
      <div class="sticky top-0 flex justify-between items-center h-32 text-text bg-purple px-12 z-100 select-none shadow-sm shadow-black">
        <div class="flex items-center gap-4">
          <img class="h-16 w-16" src="./logo-edited.png" alt="Logo" />
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
          <div class="hover:text-yellow cursor-pointer">Login</div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
