/* @refresh solid */
import { Component, Show, createMemo, createSignal, onMount } from "solid-js";
import {
  onValue,
  ref as databaseRef,
  set as databaseSet,
  get as databaseGet,
} from "firebase/database";
import { firebaseDatabase } from "..";

import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import { useFetchImagesQuery } from "../services/ImageService";

import { useBattlemap, useGridLayer } from "../hooks/BattlemapHooks";

import ImageCropperModalComponent from "../components/battlemap/ImageCropperModalComponent";
import MapToolComponent from "../components/utils/MapToolComponent";
import SearchBarComponent from "../components/utils/SearchBarComponent";
import YoutubeEmbedComponent from "../components/utils/YoutubeEmbedComponent";
import YoutubeMenuComponent from "../components/utils/YoutubeMenuComponent";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import ModalComponent from "../components/ModalComponent";
import { MediaInterface } from "../types/MediaType";

const Battlemap: Component = () => {
  let map: Leaflet.Map;
  let gridLayer: Leaflet.GeoJSON;
  let mapDiv = document.createElement("div") as HTMLDivElement;

  const [imageCropperModal, setImageCropperModal] = createSignal(false);
  const [image, setImage] = createSignal<string>();
  const [music, setMusic] = createSignal<string>();

  /* !!! START OF MAP TOOL || MOVE TO COMPONENT LATER !!! */
  const [queryBegin, setQueryBegin] = createSignal("maps");
  /* !!! END OF MAP TOOL || MOVE TO COMPONENT LATER !!! */

  createMemo(() => {
    mapDiv.style.height = window.innerHeight - navbarHeight.height + "px";
    if (!map) return;
    setTimeout(() => map.invalidateSize(), 1);
  });

  onMount(async () => {
    map = useBattlemap(mapDiv);
    //gridLayer = useGridLayer(map);

    onValue(databaseRef(firebaseDatabase, "character/src"), (snapshot) => {
      setImage(snapshot.val());
    });

    onValue(databaseRef(firebaseDatabase, "music/src"), (snapshot) => {
      setMusic(snapshot.val());
    });
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
          </>
        </MapToolComponent>
        <MapToolComponent
          class1="absolute right-0 top-0 z-[1000]"
          class2="flex flex-col gap-1 p-4 w-52"
        >
          <>
            <button
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red text-text"
              onClick={() => {
                const src =
                  image() === "/characters/character-images/noc.png"
                    ? "/characters/character-images/instance.png"
                    : "/characters/character-images/noc.png";

                databaseSet(databaseRef(firebaseDatabase, "character"), {
                  src,
                });
              }}
            >
              Change image
            </button>

            <Show when={image()}>
              <img src={image()} class="w-full aspect-square object-cover" />
            </Show>
          </>
        </MapToolComponent>
        <MapToolComponent
          class1="absolute left-0 bottom-0 z-[1000]"
          class2="flex flex-col w-[550px] p-4"
        >
          <YoutubeMenuComponent />
          <YoutubeEmbedComponent class="aspect-video" src={music} />
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
