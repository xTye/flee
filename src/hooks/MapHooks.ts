import Leaflet from "leaflet";
import { Accessor, Setter } from "solid-js";

import { MarkerInterface } from "../types/MarkerType";
import {
  useUpdateMarker,
  useCreateMarker,
  useFetchMarkers,
} from "../services/MarkerService";

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
  test: Leaflet.icon({
    iconUrl: "/maps/util-images/marker-black.png",
    iconSize: [64, 64],
    iconAnchor: [0, 64],
  }),
};

export const useMap = async (
  div: HTMLDivElement,
  editMarker: Accessor<MarkerInterface | undefined>,
  setMarker: Setter<MarkerInterface | undefined>,
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
    }).addTo(map);

    leafletClickListener(
      map,
      leafletMarker,
      marker,
      setMarker,
      editMarker,
      setLeafletEditMarker
    );
  }

  worldLayer.redraw();

  return map;
};

export const useCreateEditMarker = (
  map: Leaflet.Map,
  editMarker: Accessor<MarkerInterface | undefined>,
  setEditMarker: Setter<MarkerInterface>,
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
    id: "",
    name: "",
    description: "",
    x: leafletMarker.getLatLng().lat,
    y: leafletMarker.getLatLng().lng,
    color: "black",
    maps: [],
  });

  leafletMarker.on("drag", () => {
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
  marker: MarkerInterface,
  editMarker: Accessor<MarkerInterface | undefined>,
  setEditMarker: Setter<MarkerInterface>,
  leafletEditMarker: Leaflet.Marker
) => {
  leafletEditMarker.dragging?.enable();

  map.flyTo(
    [leafletEditMarker.getLatLng().lat, leafletEditMarker.getLatLng().lng],
    4
  );

  console.log(marker);

  setEditMarker({
    ...marker,
    x: leafletEditMarker.getLatLng().lat,
    y: leafletEditMarker.getLatLng().lng,
    previousData: {
      ...marker,
      x: leafletEditMarker.getLatLng().lat,
      y: leafletEditMarker.getLatLng().lng,
    },
  });

  leafletEditMarker.on("drag", () => {
    // Accessor because editMarker() is undefined
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
  editMarker: MarkerInterface | undefined,
  leafletEditMarker: Leaflet.Marker,
  setEditMarker: Setter<MarkerInterface | undefined>
) => {
  // Previous Data is undefined when the marker is new
  if (!editMarker?.previousData) leafletEditMarker.removeFrom(map);
  else {
    leafletEditMarker.setLatLng(
      new Leaflet.LatLng(editMarker.previousData.x, editMarker.previousData.y)
    );
  }

  leafletEditMarker.removeEventListener("drag");
  leafletEditMarker.dragging?.disable();

  setEditMarker(undefined);
};

export const removeAllLeafletListeners = (map: Leaflet.Map) => {
  console.log(map);
  map.eachLayer((marker) => {
    if (marker instanceof Leaflet.Marker) {
      marker.off();
    }
  });
};

export const useComfirmEditMarker = async (
  map: Leaflet.Map,
  editMarker: Accessor<MarkerInterface | undefined>,
  leafletEditMarker: Leaflet.Marker,
  setLeafletEditMarker: Setter<Leaflet.Marker>,
  setEditMarker: Setter<MarkerInterface | undefined>,
  setMarker: Setter<MarkerInterface | undefined>
) => {
  try {
    const insEditMarker = editMarker();
    if (!insEditMarker) throw new Error("Edit Marker is undefined");

    const marker: MarkerInterface = {
      name: insEditMarker.name,
      description: insEditMarker.description,
      x: insEditMarker.x,
      y: insEditMarker.y,
      color: insEditMarker.color,
      maps: insEditMarker.maps,
    };

    // Call services
    let id;

    if (insEditMarker.id && insEditMarker.previousData) {
      await useUpdateMarker(insEditMarker.id, marker);
      id = insEditMarker.id;
    } else id = await useCreateMarker(marker);

    if (!id) return;

    // Update click listener
    leafletClickListener(
      map,
      leafletEditMarker,
      { ...marker, id },
      setMarker,
      editMarker,
      setLeafletEditMarker
    );

    leafletEditMarker.removeEventListener("drag");
    leafletEditMarker.dragging?.disable();

    setMarker({
      ...marker,
      id: insEditMarker.id,
    });
    setEditMarker(undefined);
  } catch (e) {
    console.error(e);
  }
};

const leafletClickListener = (
  map: Leaflet.Map,
  leafletMarker: Leaflet.Marker,
  marker: MarkerInterface,
  setMarker: Setter<MarkerInterface | undefined>,
  editMarker: Accessor<MarkerInterface | undefined>,
  setLeafletEditMarker: Setter<Leaflet.Marker>
) => {
  leafletMarker.removeEventListener("click");

  leafletMarker.on("click", () => {
    if (editMarker()) return;

    setMarker(marker);
    setLeafletEditMarker(leafletMarker);
    map.flyTo([marker.x, marker.y], 4);
  });
};
