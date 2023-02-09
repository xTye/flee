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

  Leaflet.tileLayer("./maps/{z}/{x}/{y}.jpg", {
    attribution: "Al'ard Al'umu",
  }).addTo(map);

  const icon = Leaflet.icon({
    iconUrl: "marker.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  fetch("./markers.json")
    .then((res) => res.json())
    .then((json) => {
      for (const marker in json) {
        console.log(json[marker].x, json[marker].y);

        const popupContent = Leaflet.popup().setContent(
          json[marker].description
        );

        Leaflet.marker([json[marker].x, json[marker].y], {
          icon,
          title: json[marker].name,
        })
          .bindPopup(popupContent)
          .addTo(map);
      }
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
