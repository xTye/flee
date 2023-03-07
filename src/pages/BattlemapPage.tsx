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
import {
  onValue,
  ref as databaseRef,
  set as databaseSet,
  get as databaseGet,
} from "firebase/database";
import { firebaseDatabase } from "..";

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

    const img = await databaseGet(
      databaseRef(firebaseDatabase, "character/src")
    );
    setImage(img.val());

    onValue(databaseRef(firebaseDatabase, "character/src"), (snapshot) => {
      setImage(snapshot.val());
    });

    const music = await databaseGet(databaseRef(firebaseDatabase, "music/src"));
    setMusic(music.val());

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
          class2="flex flex-col gap-1 p-4"
        >
          <>
            <button
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red text-text"
              onClick={() => {
                const src =
                  music() ===
                  "https://www.youtube.com/embed/DuDZbDGCRf0?autoplay=1&loop=1&playlist=DuDZbDGCRf0"
                    ? "https://www.youtube.com/embed/MHxJXBLJW98?autoplay=1&loop=1&playlist=MHxJXBLJW98"
                    : "https://www.youtube.com/embed/DuDZbDGCRf0?autoplay=1&loop=1&playlist=DuDZbDGCRf0";

                databaseSet(databaseRef(firebaseDatabase, "music"), {
                  src,
                });
              }}
            >
              Change music
            </button>

            <Show when={music()}>
              <iframe
                src={music()}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </Show>
          </>
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
