import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { createMemo } from "solid-js";

import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  useMap,
  useCreateEditMarker,
  useRemoveEditMarker,
  useUpdateEditMarker,
  useComfirmEditMarker,
  removeAllLeafletListeners,
} from "../hooks/MapHook";
import { MarkerInterface } from "../types/MarkerType";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import { useSession } from "../auth";

import MarkerEditorComponent from "../components/map/MarkerEditorComponent";
import { useNavigate } from "@solidjs/router";

const MapPage: Component = () => {
  const [session, actions] = useSession();
  const navigator = useNavigate();

  let map: Leaflet.Map;
  let mapDiv = document.createElement("div") as HTMLDivElement;

  const rmc = removeAllLeafletListeners;

  const [marker, setMarker] = createSignal<MarkerInterface>();
  const [editMarker, setEditMarker] = createSignal<MarkerInterface>();
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
    rmc(map);
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
                <Show when={leafletEditMarker()} keyed>
                  {(insLeafletEditMarker: Leaflet.Marker) => (
                    <Show when={editMarker()} keyed>
                      {(insEditMarker: MarkerInterface) => (
                        <>
                          <button
                            class="p-1 hover:bg-red rounded-md"
                            onClick={() => {
                              useComfirmEditMarker(
                                map,
                                editMarker,
                                insLeafletEditMarker,
                                setLeafletEditMarker,
                                setEditMarker,
                                setMarker,
                                navigator
                              );
                            }}
                          >
                            <img
                              src="/util-images/check.svg"
                              class="w-4 h-4 "
                            />
                          </button>
                          <button
                            class="p-1 hover:bg-red rounded-md"
                            onClick={() => {
                              useRemoveEditMarker(
                                map,
                                insEditMarker,
                                insLeafletEditMarker,
                                setEditMarker
                              );
                            }}
                          >
                            <img
                              src="/util-images/trash.svg"
                              class="w-4 h-4 "
                            />
                          </button>
                        </>
                      )}
                    </Show>
                  )}
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
                        {(insMarker: MarkerInterface) => (
                          <button class="p-1 hover:bg-red rounded-md">
                            <img
                              src="/util-images/edit.svg"
                              class="w-4 h-4"
                              onClick={() => {
                                useUpdateEditMarker(
                                  map,
                                  insMarker,
                                  editMarker,
                                  setEditMarker,
                                  insLeafletEditMarker
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
                    {(insMarker: MarkerInterface) => (
                      <MarkerEditorComponent
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

export default MapPage;
