import Leaflet from "leaflet";
import * as Turf from "@turf/turf";
import * as geojson from "geojson";
import { icons } from "./MapHooks";

export interface GridData {
  deltaX: number;
  deltaY: number;
  deltaLat: number;
  deltaLng: number;
  maxI: number;
  maxJ: number;
  tiles: {
    i: number;
    j: number;
    x: number;
    y: number;
    lat: number;
    lng: number;
    layer: Leaflet.Layer;
  }[][];
}

export interface BackgroundLayerInterface {
  layerGroup: Leaflet.LayerGroup;
  backgroundImage: Leaflet.ImageOverlay;
}

const maxBounds = [
  [-1, -1],
  [1, 1],
];

// export const useBattlemap = (
//   div: HTMLDivElement,
//   tokenLayer: Leaflet.LayerGroup
// ) => {
//   const map = Leaflet.map(div, {
//     center: [0, 0],
//     // @ts-ignore
//     maxBounds,
//     zoom: 10,
//     minZoom: 8,
//     maxZoom: 12,
//   });

//   map.zoomControl.setPosition("bottomright");

// map.on("zoomend", (e) => {
//   const zoom = map.getZoom();

//   for (const token of tokenLayer.getLayers()) {
//     // @ts-ignore
//     const icon: Leaflet.Icon = token.getIcon();
//     //! Magic Number 10 and 64
//     const zoom = map.getZoom();
//     const scale = 2 ** (zoom - 10);
//     console.log(zoom, 10 - zoom, scale);
//     icon.options.iconSize = [64 * scale, 64 * scale];
//     icon.options.iconAnchor = [0, 64 * scale];
//     // @ts-ignore
//     token.setIcon(icon);
//   }
// });

//   const backgroundLayer = Leaflet.layerGroup().addTo(map);

//   const backgroundImage = Leaflet.imageOverlay(
//     "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-cat-photos-1593441022.jpg",
//     map.options.maxBounds!
//   )
//     .bringToFront()
//     .addTo(backgroundLayer);

//   backgroundLayer.eachLayer((layer) => {
//     layer.on("click", (e) => {
//       console.log("click");
//     });
//   });

//   //tokenLayer.addTo(map);

//   return map;
// };

export const useBattlemap = (div: HTMLDivElement) => {
  const map = Leaflet.map(div, {
    center: [0, 0],
    // @ts-ignore
    maxBounds,
    zoom: 10,
    minZoom: 8,
    maxZoom: 12,
  });

  map.zoomControl.setPosition("bottomright");

  return map;
};

export const useBackgroundLayer = (map: Leaflet.Map) => {
  const layerGroup = Leaflet.layerGroup().addTo(map);

  const backgroundImage = Leaflet.imageOverlay(
    "/maps/lowres-maps/Daggerfalls.jpg",
    map.options.maxBounds!,
    {
      interactive: true,
    }
  )
    .bringToFront()
    .addTo(layerGroup);

  return {
    layerGroup,
    backgroundImage,
  };
};

export const useGridLayer = (map: Leaflet.Map): [Leaflet.GeoJSON, any] => {
  // @ts-ignore
  const bounds = Leaflet.latLngBounds(map.options.maxBounds!);
  const grid = Turf.squareGrid(
    [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    10,
    {
      units: "kilometers",
    }
  );

  const data: GridData = {
    deltaX: 0,
    deltaY: 0,
    deltaLat: 0,
    deltaLng: 0,
    maxI: 0,
    maxJ: 0,
    tiles: [[]],
  };

  let minX = Number.NEGATIVE_INFINITY;
  let i = -1;
  let j = -1;

  const gridLayer = Leaflet.geoJSON(grid, {
    interactive: false,
    style: {
      color: "#000",
      weight: 1,
      opacity: 0.2,
      fillOpacity: 0,
    },
    onEachFeature: (feature, layer) => {
      // @ts-ignore
      const cords: any = feature.geometry.coordinates[0];
      const x = cords[0][0];
      const y = cords[0][1];
      if (minX < x) {
        if (i !== -1) data.tiles.push([]);
        minX = x;
        i++;
      }
      data.tiles[i].push({ i, j, x, y, lat: y, lng: x, layer });
    },
  });

  data.deltaX = Math.abs(data.tiles[1][0].x - data.tiles[0][0].x);
  data.deltaY = Math.abs(data.tiles[0][1].y - data.tiles[0][0].y);
  data.deltaLat = data.deltaY;
  data.deltaLng = data.deltaX;
  data.maxI = data.tiles.length - 1;
  data.maxJ = data.tiles[0].length - 1;

  gridLayer.addTo(map);

  return [gridLayer, data];
};

export const useTokenLayer = (map: Leaflet.Map) => {
  const tokenLayer = Leaflet.layerGroup().addTo(map);

  return tokenLayer;
};

export const useCreateImage = (map: Leaflet.Map) => {};

export const useCreateBackgroundImage = (
  map: Leaflet.Map,
  backgroundLayer: BackgroundLayerInterface,
  e: DragEvent
) => {
  let icon = icons["test"] as Leaflet.Icon;
  icon.options.iconUrl = "/campaign-images/logo-edited.png";
  // @ts-ignore
  const width = e.target.naturalWidth as number;
  // @ts-ignore
  const height = e.target.naturalHeight as number;
  console.log(width, height);

  // let imageOverlay = Leaflet.imageOverlay(
  //   "/campaign-images/logo-edited.png",
  //   bounds,
  //   {
  //     interactive: true,
  //   }
  // )
  //   .on("mousedown", (e) => {
  //     if (e.originalEvent.button !== 0) return;
  //     imageOverlay.setOpacity(0.5);
  //     const tile = calculateTile(e.latlng, data);

  //     icon = getScaledIconFromMap(icon, map);
  //     marker = Leaflet.marker([tile.lat, tile.lng], {
  //       icon,
  //       draggable: true,
  //       autoPan: true,
  //     }).addTo(tokenLayer);

  //     marker.on("mouseup", (e) => {
  //       imageOverlay.setOpacity(1);
  //       imageOverlay.setBounds(
  //         getBoundsFromData(map.mouseEventToLatLng(e.originalEvent), data)
  //       );
  //       marker.remove();
  //     });

  //     // @ts-ignore
  //     marker.dragging?._draggable._onDown(e.originalEvent);
  //   })
  //   .on("mouseover", (e) => {
  //     map.dragging.disable();
  //   })
  //   .on("mouseout", (e) => {
  //     map.dragging.enable();
  //   })
  //   .bringToFront()
  //   .addTo(backgroundLayer.layerGroup);
};

export const calculateTile = (pos: Leaflet.LatLng, data: GridData) => {
  const i = Math.max(
    0,
    Math.min(
      data.maxI,
      Math.floor((pos.lng + Math.abs(data.tiles[0][0].lng)) / data.deltaLng)
    )
  );
  const j = Math.max(
    0,
    Math.min(
      data.maxJ,
      Math.floor((pos.lat + Math.abs(data.tiles[0][0].lat)) / data.deltaLat)
    )
  );

  return data.tiles[i][j];
};

export const getBoundsFromData = (
  pos: Leaflet.LatLng,
  data: GridData,
  options?: { center: boolean }
) => {
  if (options?.center) {
    pos.lat += data.deltaLat / 2;
    pos.lng += data.deltaLng / 2;
  }

  const tile = calculateTile(pos, data);

  const southWest = Leaflet.latLng(tile.lat, tile.lng);
  const northEast = Leaflet.latLng(
    tile.lat + data.deltaLat,
    tile.lng + data.deltaLng
  );

  return Leaflet.latLngBounds(southWest, northEast);
};

export const getScaledIconFromMap = (
  icon: Leaflet.Icon,
  map: Leaflet.Map,
  options?: { scale: number }
) => {
  const zoom = map.getZoom();
  const scale = 2 ** (zoom - 10) * (options?.scale ?? 1);
  icon.options.iconSize = [64 * scale, 64 * scale];
  icon.options.iconAnchor = [0, 64 * scale];
  return icon;
};
