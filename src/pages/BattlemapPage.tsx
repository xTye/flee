import { Component, Show, createMemo, createSignal, onMount } from "solid-js";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import ModalComponent from "../components/ModalComponent";

import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import ImageCropperModalComponent from "../components/battlemap/ImageCropperModalComponent";
import { useBattlemap, useGridLayer } from "../hooks/BattlemapHooks";
import MapToolComponent from "../components/utils/MapToolComponent";
import SearchBarComponent from "../components/utils/SearchBarComponent";
import { useFetchImagesQuery } from "../services/ImageService";

const Battlemap: Component = () => {
  let map: Leaflet.Map;
  let gridLayer: Leaflet.GeoJSON;
  let mapDiv = document.createElement("div") as HTMLDivElement;

  const [imageCropperModal, setImageCropperModal] = createSignal(false);

  /* !!! START OF MAP TOOL || MOVE TO COMPONENT LATER !!! */
  const [queryBegin, setQueryBegin] = createSignal("maps");
  /* !!! END OF MAP TOOL || MOVE TO COMPONENT LATER !!! */

  createMemo(() => {
    mapDiv.style.height = window.innerHeight - navbarHeight.height + "px";
    if (!map) return;
    setTimeout(() => map.invalidateSize(), 1);
  });

  onMount(() => {
    map = useBattlemap(mapDiv);
    //gridLayer = useGridLayer(map);
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
        </MapToolComponent>
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
