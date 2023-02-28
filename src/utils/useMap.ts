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
        if (!editMarker()) {
          setMarker({
            name: marker.name,
            description: marker.description,
            x: marker.x,
            y: marker.y,
            color: marker.color,
          });

          setLeafletEditMarker(leafletMarker);
        }

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

  setEditMarker({
    name: "",
    description: "",
    x: leafletMarker.getLatLng().lat,
    y: leafletMarker.getLatLng().lng,
    color: "",
  });

  leafletMarker.addEventListener("drag", () => {
    // Accessor because editMarker() is undefined
    const insEditMarker = editMarker();
    if (!insEditMarker) return;

    setEditMarker({
      ...insEditMarker,
      x: leafletMarker.getLatLng().lat,
      y: leafletMarker.getLatLng().lng,
    });
  });

  setLeafletEditMarker(leafletMarker);
};

export const useUpdateEditMarker = (
  map: Leaflet.Map,
  marker: Marker,
  editMarker: Accessor<Marker | undefined>,
  setEditMarker: Setter<Marker>,
  leafletEditMarker: Leaflet.Marker
) => {
  leafletEditMarker.dragging?.enable();

  map.flyTo(
    [leafletEditMarker.getLatLng().lat, leafletEditMarker.getLatLng().lng],
    4
  );

  setEditMarker({
    name: marker.name,
    description: marker.description,
    x: leafletEditMarker.getLatLng().lat,
    y: leafletEditMarker.getLatLng().lng,
    color: marker.color,
    previousData: {
      name: marker.name,
      description: marker.description,
      x: leafletEditMarker.getLatLng().lat,
      y: leafletEditMarker.getLatLng().lng,
      color: marker.color,
    },
  });

  leafletEditMarker.addEventListener("drag", () => {
    const insEditMarker = editMarker();
    if (!insEditMarker) return;

    setEditMarker({
      ...insEditMarker,
      x: leafletEditMarker.getLatLng().lat,
      y: leafletEditMarker.getLatLng().lng,
    });
  });
};

export const useRemoveEditMarker = (
  map: Leaflet.Map,
  editMarker: Marker | undefined,
  leafletEditMarker: Leaflet.Marker,
  setEditMarker: Setter<Marker | undefined>
) => {
  leafletEditMarker.removeEventListener("drag");

  if (!editMarker?.previousData) leafletEditMarker.removeFrom(map);
  else {
    leafletEditMarker.setLatLng(
      new Leaflet.LatLng(editMarker.previousData.x, editMarker.previousData.y)
    );
  }

  leafletEditMarker.dragging?.disable();

  setEditMarker(undefined);
};

export const useComfirmEditMarker = (
  map: Leaflet.Map,
  editMarker: Marker | undefined,
  leafletEditMarker: Leaflet.Marker,
  setEditMarker: Setter<Marker | undefined>
) => {
  leafletEditMarker.removeEventListener("drag");

  if (!editMarker?.previousData) leafletEditMarker.removeFrom(map);
  else {
    leafletEditMarker.setLatLng(
      new Leaflet.LatLng(editMarker.previousData.x, editMarker.previousData.y)
    );
  }

  leafletEditMarker.dragging?.disable();

  setEditMarker(undefined);
};
