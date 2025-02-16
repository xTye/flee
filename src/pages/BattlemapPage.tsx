/* @refresh solid */

import { Component, Show, createMemo, createSignal, onMount } from "solid-js";

import "leaflet/dist/leaflet.css";

import { navbarHeight } from "../components/navbar/NavbarComponent";
import BattlemapMediaPlayerComponent from "../components/battlemap/BattlemapMediaPlayerComponent";
import BattlemapSlideshowComponent from "../components/battlemap/BattlemapSlideshowComponent";
import BattlemapEditorComponent from "../components/battlemap/BattlemapEditorComponent";
import { ModalProvider } from "../components/utils/ModalContextProvider";
import KonvaComponent from "../components/battlemap/KonvaComponent";
import { BattlemapClass } from "../classes/battlemap/BattlemapClass";
import { KonvaClass } from "@/classes/konva/KonvaClass";

const BattlemapPage: Component = () => {
  let mapDiv = document.createElement("div") as HTMLDivElement;
  let battlemap = undefined as unknown as BattlemapClass;
  let konva = undefined as unknown as KonvaClass;
  const [loaded, setLoaded] = createSignal(false);

  onMount(() => {
    battlemap = new BattlemapClass(mapDiv);
    setLoaded(true);
  });

  createMemo(() => {
    mapDiv.style.height = window.innerHeight - navbarHeight.height + "px";
    if (!battlemap || !battlemap.map) return;
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
        <Show when={loaded()}>
          <ModalProvider>
            <BattlemapEditorComponent battlemap={battlemap} konva={konva} />
            <BattlemapSlideshowComponent battlemap={battlemap} />
            {/* <BattlemapMediaPlayerComponent /> */}
          </ModalProvider>
          <KonvaComponent battlemap={battlemap} konva={konva} />
        </Show>
        <div ref={mapDiv}></div>
      </div>
    </>
  );
};

export default BattlemapPage;
