/* @refresh solid */

//! Notes
// Check why the cat doesn't produce a square.
// Easily change between battlemaps using the setUrl method.

import { Component, createMemo, onMount } from "solid-js";

import "leaflet/dist/leaflet.css";

import {
  useBackgroundLayer,
  useBattlemap,
  useCreateCharacterImage,
  useFogLayer,
  useGridLayer,
  useTokenLayer,
} from "../hooks/BattlemapHooks";

import { navbarHeight } from "../components/navbar/NavbarComponent";
import BattlemapMediaPlayerComponent from "../components/battlemap/BattlemapMediaPlayerComponent";
import BattlemapSlideshowComponent from "../components/battlemap/BattlemapSlideshowComponent";
import { BattlemapInterface } from "../types/BattlemapType";
import BattlemapEditorComponent from "../components/battlemap/BattlemapEditorComponent";
import { ModalProvider } from "../components/utils/ModalContextProvider";

const Battlemap: Component = () => {
  let mapDiv = document.createElement("div") as HTMLDivElement;
  const battlemap: BattlemapInterface = {} as BattlemapInterface;

  onMount(async () => {
    battlemap.map = useBattlemap(mapDiv, battlemap);
    battlemap.background = useBackgroundLayer(battlemap);
    battlemap.grid = useGridLayer(battlemap);
    battlemap.token = useTokenLayer(battlemap);
    battlemap.fog = useFogLayer(battlemap);
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
        class="relative bg-lightPurple select-none"
      >
        <ModalProvider>
          <BattlemapEditorComponent battlemap={battlemap} />
          <BattlemapSlideshowComponent battlemap={battlemap} />
          {/* <BattlemapMediaPlayerComponent /> */}
        </ModalProvider>
        <div ref={mapDiv}></div>
      </div>
    </>
  );
};

export default Battlemap;
