/* @refresh solid */

//! Notes
// Check why the cat doesn't produce a square.
// Easily change between battlemaps using the setUrl method.
// TODO: Set the dragging images to undefined after delete.

import { Component, Show, createMemo, createSignal, onMount } from "solid-js";

import Leaflet, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

import { useFetchImagesQuery } from "../services/ImageService";

import {
  useBackgroundLayer,
  useBattlemap,
  useCreateBackgroundImage,
  useGridLayer,
  useTokenLayer,
} from "../hooks/BattlemapHooks";

import MapToolComponent from "../components/utils/MapToolComponent";
import SearchBarComponent from "../components/utils/SearchBarComponent";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import BattlemapMediaPlayerComponent from "../components/battlemap/BattlemapMediaPlayerComponent";
import BattlemapSlideshowComponent from "../components/battlemap/BattlemapSlideshowComponent";
import { CharacterInterface } from "../types/CharacterType";
import { icons } from "../hooks/MapHooks";
import { BattlemapInterface } from "../types/BattlemapType";

const Battlemap: Component = () => {
  let mapDiv = document.createElement("div") as HTMLDivElement;
  const battlemap: BattlemapInterface = {} as BattlemapInterface;

  /* !!! START OF MAP TOOL || MOVE TO COMPONENT LATER !!! */
  const [queryBegin, setQueryBegin] = createSignal("maps");
  /* !!! END OF MAP TOOL || MOVE TO COMPONENT LATER !!! */

  onMount(async () => {
    battlemap.map = useBattlemap(mapDiv, battlemap);
    battlemap.background = useBackgroundLayer(battlemap);
    battlemap.grid = useGridLayer(battlemap);
    battlemap.tokens = useTokenLayer(battlemap);
  });

  createMemo(() => {
    mapDiv.style.height = window.innerHeight - navbarHeight.height + "px";
    if (!battlemap.map) return;
    setTimeout(() => battlemap.map.invalidateSize(), 1);
  });


  return (
    <>
      <div
        style={{
          height: (mapDiv.style.height =
            window.innerHeight - navbarHeight.height + "px"),
        }}
        class="relative bg-lightPurple"
      >
        <MapToolComponent>
          <>
            <div class="flex gap-4">
              <SearchBarComponent
                queryBegin={`/battlemap/${queryBegin()}/`}
                useFetch={useFetchImagesQuery}
                itemComponent={(result: any, i) => <div>{result.name}</div>}
              />
              <select
                class="text-black rounded-md"
                onChange={(e) => {
                  setQueryBegin(e.currentTarget.value);
                }}
              >
                <option selected={queryBegin() === "maps"} value="maps">
                  Map
                </option>
                <option
                  selected={queryBegin() === "characters"}
                  value="characters"
                >
                  Character
                </option>
              </select>
            </div>
            <button
              onClick={() => {
                battlemap.background.image.setUrl(
                  "/maps/lowres-maps/Beastlands.jpg"
                );
              }}
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Toggle
            </button>
            <button
              onClick={() => {
                battlemap.background.image.setUrl(
                  "/maps/lowres-maps/Candlekeep.jpg"
                );
              }}
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Toggle
            </button>
            <button
              onClick={() => {
                battlemap.background.image.setUrl(
                  "/maps/lowres-maps/Daggerfalls.jpg"
                );
              }}
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Toggle
            </button>
            <img
              src="/campaign-images/logo-edited.png"
              class="w-12 h-12 object-cover"
              draggable
              onDragEnd={(e) => {
                useCreateBackgroundImage(e, battlemap);
              }}
            />
          </>
        </MapToolComponent>
        {/* <BattlemapSlideshowComponent characterDragEnd={callback} />
        <BattlemapMediaPlayerComponent /> */}
        <div ref={mapDiv}></div>
      </div>
    </>
  );
};

export default Battlemap;
