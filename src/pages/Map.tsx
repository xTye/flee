import { Component, createSignal, onMount, Show } from "solid-js";
import { createMemo } from "solid-js";

import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import { Location, useMap } from "../utils/useMap";
import { navbarHeight } from "../components/navbar/Navbar";

const Map: Component = () => {
  let map: Leaflet.Map;
  let mapDiv = document.createElement("div") as HTMLDivElement;

  const [location, setLocation] = createSignal<Location>({
    title: "",
    description: "",
  });

  createMemo(() => {
    mapDiv.style.height = window.innerHeight - navbarHeight.height + "px";
    if (!map) return;
    setTimeout(() => map.invalidateSize(), 1);
  });

  onMount(() => {
    map = useMap(mapDiv, setLocation);
  });

  return (
    <>
      <div
        style={{
          height: (mapDiv.style.height =
            window.innerHeight - navbarHeight.height + "px"),
        }}
        class="relative"
      >
        <div class="absolute top-0 z-[2000]">
          <div class="relative w-72 h-96 m-4 p-4 bg-white rounded-md overflow-hidden">
            <div class="flex font-bold items-center justify-center pb-2 mb-2 gap-4 border-b-2 border-purple">
              <div class="text-lg">Legend</div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-2">
                  <img
                    src="/maps/util-images/marker-gold.png"
                    class="w-4 h-4"
                  />
                  <div class="text-xs">Current</div>
                </div>
                <div class="flex gap-2">
                  <img src="/maps/util-images/marker-red.png" class="w-4 h-4" />
                  <div class="text-xs">Visited</div>
                </div>
                <div class="flex gap-2">
                  <img
                    src="/maps/util-images/marker-blue.png"
                    class="w-4 h-4"
                  />
                  <div class="text-xs">Known</div>
                </div>
              </div>
            </div>

            <Show when={location().title === ""}>
              <div class="text-3xl">{location().title}</div>
              <div class="overflow-y-auto break-words h-full">
                {location().description}
              </div>
            </Show>
            <Show when={location().title !== ""}>
              <div class="flex justify-between items-center">
                <div class="text-3xl"></div>
              </div>
              <div class="text-3xl">{location().title}</div>
              <div class="overflow-y-auto break-words h-full">
                {location().description}
              </div>
            </Show>
          </div>
        </div>
        <div ref={mapDiv}></div>
      </div>
    </>
  );
};

export default Map;
