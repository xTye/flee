import { Component, onMount, createSignal } from "solid-js";
import { createMemo } from "solid-js";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { navbarHeight } from "../components/Navbar";

const buildMap = (div: HTMLDivElement) => {
  const map = Leaflet.map(div, {
    minZoom: 2,
    maxZoom: 5,
  }).setView([10, 50], 4); //tes

  const worldLayer = Leaflet.tileLayer("./maps/{z}/{x}/{y}.jpg", {
    attribution: "Al'ard Al'umu",
  }).addTo(map);

  const icons: any = {
    red: Leaflet.icon({
      iconUrl: "marker-red.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
    blue: Leaflet.icon({
      iconUrl: "marker-blue.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
    gold: Leaflet.icon({
      iconUrl: "marker-gold.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
    black: Leaflet.icon({
      iconUrl: "marker-black.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
  };

  fetch("./markers.json")
    .then((res) => res.json())
    .then((json) => {
      for (const marker in json) {
        const popupContent = Leaflet.popup({
          content: json[marker].description,
        });

        Leaflet.marker([json[marker].x, json[marker].y], {
          icon: icons[json[marker].color ? json[marker].color : "black"],
          title: json[marker].name,
        })
          .bindPopup(popupContent)
          .addTo(map);
      }

      worldLayer.redraw();
    });

  return map;
};

const Map: Component = () => {
  let map: Leaflet.Map;
  let mapDiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;

  createMemo(() => {
    mapDiv.style.height = window.innerHeight - navbarHeight.height + "px";
    if (!map) return;
    setTimeout(() => map.invalidateSize(), 1);
  });

  onMount(() => {
    map = buildMap(mapDiv);
  });

  return (
    <div
      ref={mapDiv}
      style={{
        height: (mapDiv.style.height =
          window.innerHeight - navbarHeight.height + "px"),
      }}
      id="map"
    ></div>
  );
};

export default Map;
