import { Component, Show, createMemo, createSignal, onMount } from "solid-js";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import ModalComponent from "../components/ModalComponent";

import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import ImageCropperModalComponent from "../components/battlemap/ImageCropperModalComponent";
import { useBattlemap, useGrid } from "../hooks/BattlemapHooks";

const Battlemap: Component = () => {
  let map: Leaflet.Map;
  let mapDiv = document.createElement("div") as HTMLDivElement;
  const squares = new Array(100);

  const [imageCropperModal, setImageCropperModal] = createSignal(false);

  createMemo(() => {
    mapDiv.style.height = window.innerHeight - navbarHeight.height + "px";
    if (!map) return;
    setTimeout(() => map.invalidateSize(), 1);
  });

  onMount(() => {
    map = useBattlemap(mapDiv);
    useGrid(map);
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
        <div ref={mapDiv}></div>
        <Show when={imageCropperModal()}>
          <ModalComponent setModal={setImageCropperModal}>
            <ImageCropperModalComponent />
          </ModalComponent>
        </Show>
      </div>
    </>
  );
};

export default Battlemap;
