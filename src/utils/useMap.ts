import Leaflet from "leaflet";
import { Setter } from "solid-js";

export interface Location {
  title: string;
  description: string;
}

export const useMap = (div: HTMLDivElement, setState: Setter<Location>) => {
  const map = Leaflet.map(div, {
    minZoom: 2,
    maxZoom: 5,
  }).setView([10, 50], 4);

  map.zoomControl.setPosition("bottomright");

  const worldLayer = Leaflet.tileLayer("/maps/world-maps/{z}/{x}/{y}.jpg", {
    attribution: "Al'ard Al'umu",
  }).addTo(map);

  const icons: any = {
    red: Leaflet.icon({
      iconUrl: "/maps/util-images/marker-red.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
    blue: Leaflet.icon({
      iconUrl: "/maps/util-images/marker-blue.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
    gold: Leaflet.icon({
      iconUrl: "/maps/util-images/marker-gold.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
    black: Leaflet.icon({
      iconUrl: "/maps/util-images/marker-black.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
  };

  fetch("/maps/markers.json")
    .then((res) => res.json())
    .then((json) => {
      for (const marker in json) {
        Leaflet.marker([json[marker].x, json[marker].y], {
          icon: icons[json[marker].color ? json[marker].color : "black"],
          title: json[marker].name,
        })
          .addTo(map)
          .addEventListener("click", () => {
            setState({
              title: json[marker].name,
              description: json[marker].description,
            });
          });
      }

      worldLayer.redraw();
    });

  return map;
};
