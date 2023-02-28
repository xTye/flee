import Leaflet from "leaflet";
import { Accessor, Setter, onCleanup } from "solid-js";
import { useFetchMarkers, Marker } from "../hooks/markers";

export const icons: any = {
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

export const useMap = async (
  div: HTMLDivElement,
  editMarker: Accessor<Marker | undefined>,
  setMarker: Setter<Marker>,
  setLeafletEditMarker: Setter<Leaflet.Marker>
) => {
  const map = Leaflet.map(div, {
    minZoom: 2,
    maxZoom: 5,
  }).setView([10, 50], 4);

  map.zoomControl.setPosition("bottomright");

  const worldLayer = Leaflet.tileLayer("/maps/world-maps/{z}/{x}/{y}.jpg", {
    attribution: "Al'ard Al'umu",
  }).addTo(map);

  const markers = await useFetchMarkers();

  if (!markers) return map;

  for (const marker of markers) {
    const leafletMarker = Leaflet.marker([marker.x, marker.y], {
      icon: icons[marker.color],
      title: marker.name,
    })
      .addTo(map)
      .addEventListener("click", () => {
        setMarker({
          name: marker.name,
          description: marker.description,
          x: marker.x,
          y: marker.y,
          color: marker.color,
        });

        if (!editMarker()) setLeafletEditMarker(leafletMarker);

        map.flyTo([marker.x, marker.y], 4);
      });
  }

  worldLayer.redraw();

  return map;
};

export const useCreateEditMarker = (
  map: Leaflet.Map,
  editMarker: Accessor<Marker | undefined>,
  setEditMarker: Setter<Marker>,
  setLeafletEditMarker: Setter<Leaflet.Marker>
) => {
  const center = map.getCenter();

  const leafletMarker = Leaflet.marker([center.lat, center.lng], {
    icon: icons["black"],
    draggable: true,
    autoPan: true,
  }).addTo(map);

  map.flyTo([center.lat, center.lng], 4);

  leafletMarker.addEventListener("drag", () => {
    const insEditMarker = editMarker();
    if (!insEditMarker) return;

    setEditMarker({
      ...insEditMarker,
      x: leafletMarker.getLatLng().lat,
      y: leafletMarker.getLatLng().lng,
    });
  });

  setEditMarker({
    name: "",
    description: "",
    x: leafletMarker.getLatLng().lat,
    y: leafletMarker.getLatLng().lng,
    color: "",
  });

  setLeafletEditMarker(leafletMarker);
};

export const useUpdateEditMarker = (
  map: Leaflet.Map,
  editMarker: Marker,
  setEditMarker: Setter<Marker>,
  leafletEditMarker: Accessor<Leaflet.Marker | undefined>,
  setLeafletEditMarker: Setter<Leaflet.Marker>
) => {
  const insLeafletEditMarker = leafletEditMarker();
  if (!insLeafletEditMarker) return;

  insLeafletEditMarker.options.draggable = true;
  insLeafletEditMarker.options.autoPan = true;

  map.flyTo(
    [
      insLeafletEditMarker.getLatLng().lat,
      insLeafletEditMarker.getLatLng().lng,
    ],
    4
  );

  insLeafletEditMarker.addEventListener("drag", () => {
    setEditMarker({
      ...editMarker,
      x: insLeafletEditMarker.getLatLng().lat,
      y: insLeafletEditMarker.getLatLng().lng,
    });
  });

  setEditMarker({
    name: editMarker.name,
    description: editMarker.description,
    x: insLeafletEditMarker.getLatLng().lat,
    y: insLeafletEditMarker.getLatLng().lng,
    color: editMarker.color,
  });

  //setLeafletEditMarker(leafletEditMarker);
};

export const useRemoveEditMarker = (
  map: Leaflet.Map,
  leafletEditMarker: Leaflet.Marker,
  setEditMarker: Setter<Marker | undefined>
) => {
  leafletEditMarker.removeEventListener("drag");
  leafletEditMarker.removeFrom(map);
  setEditMarker(undefined);
};
