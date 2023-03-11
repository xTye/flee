/* @refresh solid */

//! Notes
// Easily change between battlemaps using the setUrl method.

import { Component, Show, createMemo, createSignal, onMount } from "solid-js";

import Leaflet, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

import { useFetchImagesQuery } from "../services/ImageService";

import {
  BackgroundLayerInterface,
  GridData,
  calculateTile,
  getBoundsFromData,
  getScaledIconFromMap,
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

const Battlemap: Component = () => {
  let map: Leaflet.Map;
  let gridLayer: Leaflet.GeoJSON;
  let backgroundLayer: BackgroundLayerInterface;
  let tokenLayer: Leaflet.LayerGroup;
  let data: GridData;
  let mapDiv = document.createElement("div") as HTMLDivElement;

  let marker: Leaflet.Marker;
  let imageOverlay: Leaflet.ImageOverlay;

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
    backgroundLayer = useBackgroundLayer(map);
    [gridLayer, data] = useGridLayer(map);
    tokenLayer = useTokenLayer(map);

    map.on("zoomstart", (e) => {
      if (marker) {
        imageOverlay.setOpacity(1);
        marker.remove();
      }
    });
  });

  const callback = (e: MouseEvent) => {
    let icon = icons["test"] as Leaflet.Icon;
    icon.options.iconUrl = "/characters/character-images/eldawyn.png";

    const pos = map.mouseEventToLatLng(e);
    const bounds = getBoundsFromData(pos, data);

    imageOverlay = Leaflet.imageOverlay(
      "/characters/character-images/eldawyn.png",
      bounds,
      {
        interactive: true,
      }
    )
      .on("mousedown", (e) => {
        if (e.originalEvent.button !== 0) return;
        imageOverlay.setOpacity(0.5);
        const tile = calculateTile(e.latlng, data);

        icon = getScaledIconFromMap(icon, map);
        marker = Leaflet.marker([tile.lat, tile.lng], {
          icon,
          draggable: true,
          autoPan: true,
        }).addTo(tokenLayer);

        marker.on("mouseup", (e) => {
          imageOverlay.setOpacity(1);
          imageOverlay.setBounds(
            getBoundsFromData(map.mouseEventToLatLng(e.originalEvent), data)
          );
          marker.remove();
        });

        // @ts-ignore
        marker.dragging?._draggable._onDown(e.originalEvent);
      })
      .on("mouseover", (e) => {
        map.dragging.disable();
      })
      .on("mouseout", (e) => {
        map.dragging.enable();
      })
      .bringToFront()
      .addTo(tokenLayer);
  };

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
                backgroundLayer.backgroundImage.setUrl(
                  "/maps/lowres-maps/Beastlands.jpg"
                );
              }}
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Toggle
            </button>
            <button
              onClick={() => {
                backgroundLayer.backgroundImage.setUrl(
                  "/maps/lowres-maps/Candlekeep.jpg"
                );
              }}
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Toggle
            </button>
            <button
              onClick={() => {
                backgroundLayer.backgroundImage.setUrl(
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
                useCreateBackgroundImage(map, backgroundLayer, e);
              }}
            />
          </>
        </MapToolComponent>
        {/* <BattlemapSlideshowComponent callback={callback} /> */}
        {/* <BattlemapMediaPlayerComponent /> */}
        <div ref={mapDiv}></div>
      </div>
    </>
  );
};

export default Battlemap;
