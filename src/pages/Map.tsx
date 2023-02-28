import {
  Component,
  createSignal,
  onCleanup,
  onMount,
  Setter,
  Show,
} from "solid-js";
import { createMemo } from "solid-js";

import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  useMap,
  icons,
  useCreateEditMarker,
  useRemoveEditMarker,
  useUpdateEditMarker,
} from "../utils/useMap";
import { Marker, useCreateMarker } from "../hooks/markers";
import { navbarHeight } from "../components/navbar/Navbar";
import { useSession } from "../auth";

import EditMarker from "../components/map/EditMarker";

const Map: Component = () => {
  const [session, actions] = useSession();

  let map: Leaflet.Map;
  let mapDiv = document.createElement("div") as HTMLDivElement;

  const rmc = useRemoveEditMarker;

  const [marker, setMarker] = createSignal<Marker>();
  const [editMarker, setEditMarker] = createSignal<Marker>();
  const [leafletEditMarker, setLeafletEditMarker] =
    createSignal<Leaflet.Marker>();

  createMemo(() => {
    mapDiv.style.height = window.innerHeight - navbarHeight.height + "px";
    if (!map) return;
    setTimeout(() => map.invalidateSize(), 1);
  });

  onMount(async () => {
    map = await useMap(mapDiv, editMarker, setMarker, setLeafletEditMarker);
  });

  onCleanup(() => {
    const insLeafletEditMarker = leafletEditMarker();
    if (insLeafletEditMarker) rmc(map, insLeafletEditMarker, setEditMarker);
    map.remove();
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
          <div class="relative flex flex-col gap-3 w-72 h-96 m-4 p-4 bg-white rounded-md overflow-hidden">
            <div class="flex font-bold items-center justify-center pb-2 gap-4 border-b-2 border-purple">
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
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex gap-2">
                  <img
                    src="/maps/util-images/marker-blue.png"
                    class="w-4 h-4"
                  />
                  <div class="text-xs">Known</div>
                </div>
                <div class="flex gap-2">
                  <img
                    src="/maps/util-images/marker-black.png"
                    class="w-4 h-4"
                  />
                  <div class="text-xs">Unknown</div>
                </div>
              </div>
            </div>

            <Show when={session().admin}>
              <div class="flex gap-2 justify-end">
                {/* Plus and trash icons when editing */}
                <Show when={editMarker()}>
                  <button class="p-1 hover:bg-red rounded-md">
                    <img src="/util-images/plus.svg" class="w-4 h-4 " />
                  </button>
                  <button
                    class="p-1 hover:bg-red rounded-md"
                    onClick={() => {
                      const insLeafletEditMarker = leafletEditMarker();
                      if (!insLeafletEditMarker) return;

                      useRemoveEditMarker(
                        map,
                        insLeafletEditMarker,
                        setEditMarker
                      );
                    }}
                  >
                    <img src="/util-images/trash.svg" class="w-4 h-4 " />
                  </button>
                </Show>

                <Show when={!editMarker()}>
                  {/* Plus and edit icons when not editing */}
                  <button
                    class="p-1 hover:bg-red rounded-md"
                    onClick={() => {
                      useCreateEditMarker(
                        map,
                        editMarker,
                        setEditMarker,
                        setLeafletEditMarker
                      );
                    }}
                  >
                    <img src="/util-images/plus.svg" class="w-4 h-4 " />
                  </button>
                  <Show when={leafletEditMarker()} keyed>
                    {(insLeafletEditMarker: Leaflet.Marker) => (
                      <Show when={marker()} keyed>
                        {(value: Marker) => (
                          <button class="p-1 hover:bg-red rounded-md">
                            <img
                              src="/util-images/edit.svg"
                              class="w-4 h-4"
                              onClick={() => {
                                useUpdateEditMarker(
                                  map,
                                  value,
                                  setEditMarker,
                                  leafletEditMarker,
                                  setLeafletEditMarker
                                );
                              }}
                            />
                          </button>
                        )}
                      </Show>
                    )}
                  </Show>
                </Show>
              </div>

              <Show when={leafletEditMarker()} keyed>
                {(insLeafletEditMarker: Leaflet.Marker) => (
                  <Show when={editMarker()} keyed>
                    {(insMarker: Marker) => (
                      <EditMarker
                        marker={insMarker}
                        leafletMarker={insLeafletEditMarker}
                        setMarker={setEditMarker}
                      />
                    )}
                  </Show>
                )}
              </Show>
            </Show>

            <Show when={marker() && !editMarker()}>
              <div class="text-3xl">{marker()?.name}</div>
              <div class="overflow-y-auto break-words h-full">
                {marker()?.description}
              </div>
            </Show>

            {/* <Show when={!location()}>
              <div class="text-3xl">{location().title}</div>
              <div class="overflow-y-auto break-words h-full">
                {location().description}
              </div>
            </Show> */}
          </div>
        </div>
        <div ref={mapDiv}></div>
      </div>
    </>
  );
};

export default Map;
