import Leaflet from "leaflet";
import * as Turf from "@turf/turf";

export const useBattlemap = (div: HTMLDivElement) => {
  const map = Leaflet.map(div, {
    center: [0, 0],
    maxBounds: [
      [-1, -1],
      [1, 1],
    ],
    zoom: 10,
    minZoom: 8,
  });

  map.zoomControl.setPosition("bottomright");

  const backgroundLayer = Leaflet.layerGroup().addTo(map);

  const backgroundImage = Leaflet.imageOverlay(
    "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-cat-photos-1593441022.jpg",
    map.getBounds()
  )
    .bringToFront()
    .addTo(backgroundLayer);

  return map;
};

export const useGridLayer = (map: Leaflet.Map) => {
  const bounds = map.getBounds();
  const grid = Turf.squareGrid(
    [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    5,
    {
      units: "kilometers",
    }
  );

  Turf.featureEach(grid, (feature, i) => {
    if (!feature.properties) return;
    feature.properties.i = i + 1;
  });

  const gridLayer = Leaflet.geoJSON(grid);

  gridLayer.addTo(map);

  return gridLayer;
};

export const useCreateImage = (map: Leaflet.Map) => {};
