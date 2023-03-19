import Leaflet, { map, Marker } from "leaflet";
import * as Turf from "@turf/turf";
import * as geojson from "geojson";
import { icons } from "./MapHooks";
import { CharacterInterface } from "../types/CharacterType";
import { BackgroundLayerInterface, BattlemapInterface, GridLayerInterface } from "../types/BattlemapType";

const maxBounds = [
  [-1, -1],
  [1, 1],
];

export const useBattlemap = (div: HTMLDivElement, battlemap: BattlemapInterface) => {
  const map = Leaflet.map(div, {
    center: [0, 0],
    // @ts-ignore
    maxBounds,
    zoom: 10,
    minZoom: 8,
    maxZoom: 12,
  });

  map.zoomControl.setPosition("bottomright");

  map.on("zoomstart", (e) => {
    if (battlemap.tokens.draggingTokenMarker) {
      battlemap.tokens.draggingTokenImage?.setOpacity(1);
      battlemap.tokens.draggingTokenMarker.remove();
    }
  });

  return map;
};

export const useBackgroundLayer = (battlemap: BattlemapInterface) => {
  const layer = Leaflet.layerGroup().addTo(battlemap.map);

  const image = Leaflet.imageOverlay(
    "/maps/lowres-maps/Daggerfalls.jpg",
    battlemap.map.options.maxBounds!,
  )
    .bringToFront()
    .addTo(layer);

  return {
    layer,
    image
  };
};

export const useGridLayer = (battlemap: BattlemapInterface) => {
  // @ts-ignore
  const bounds = Leaflet.latLngBounds(battlemap.map.options.maxBounds!);
  const gridTurf = Turf.squareGrid(
    [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    10,
    {
      units: "kilometers",
    }
  );

  const grid: GridLayerInterface = {
    layer: new Leaflet.GeoJSON(),
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

  grid.layer = Leaflet.geoJSON(gridTurf, {
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
        if (i !== -1) grid.tiles.push([]);
        minX = x;
        i++;
      }
      grid.tiles[i].push({ i, j, x, y, lat: y, lng: x, layer });
    },
  });

  grid.deltaX = Math.abs(grid.tiles[1][0].x - grid.tiles[0][0].x);
  grid.deltaY = Math.abs(grid.tiles[0][1].y - grid.tiles[0][0].y);
  grid.deltaLat = grid.deltaY;
  grid.deltaLng = grid.deltaX;
  grid.maxI = grid.tiles.length - 1;
  grid.maxJ = grid.tiles[0].length - 1;

  grid.layer.addTo(battlemap.map);

  return grid;
};

export const useTokenLayer = (battlemap: BattlemapInterface) => {
  const layer = Leaflet.layerGroup().addTo(battlemap.map);

  return {
    layer
  };
};

// Change back to the character tossed in the parameters.
export const useCreateCharacterImage = (
  e: MouseEvent,
  battlemap: BattlemapInterface,
) => {
  let icon = icons["test"] as Leaflet.Icon;
  icon.options.iconUrl = "/characters/character-images/eldawyn.png";

  const pos = battlemap.map.mouseEventToLatLng(e);
  const bounds = getBoundsFromData(pos, battlemap);

  battlemap.tokens.draggingTokenImage = Leaflet.imageOverlay(
    "/characters/character-images/eldawyn.png",
    bounds,
    {
      interactive: true,
    }
  )
    .on("mousedown", (e) => {
      if (e.originalEvent.button !== 0) return;
      battlemap.tokens.draggingTokenImage?.setOpacity(0.5);
      const tile = calculateTile(e.latlng, battlemap);

      icon = getScaledIconFromMap(icon, battlemap.map);
      battlemap.tokens.draggingTokenMarker = Leaflet.marker([tile.lat, tile.lng], {
        icon,
        draggable: true,
        autoPan: true,
      }).addTo(battlemap.tokens.layer);

      battlemap.tokens.draggingTokenMarker.on("mouseup", (e) => {
        battlemap.tokens.draggingTokenImage?.setOpacity(1);
        battlemap.tokens.draggingTokenImage?.setBounds(
          getBoundsFromData(battlemap.map.mouseEventToLatLng(e.originalEvent), battlemap)
        );
        battlemap.tokens.draggingTokenMarker?.remove();
      });

      // @ts-ignore
      marker.dragging?._draggable._onDown(e.originalEvent);
    })
    .on("mouseover", (e) => {
      battlemap.map.dragging.disable();
    })
    .on("mouseout", (e) => {
      battlemap.map.dragging.enable();
    })
    .bringToFront()
    .addTo(battlemap.tokens.layer);
};

export const useCreateBackgroundImage = (
  e: DragEvent,
  battlemap: BattlemapInterface,
) => {
  const pos = battlemap.map.mouseEventToLatLng(e);

  const imageUrl = (e.target as HTMLImageElement).currentSrc;

  const originalWidth = (e.target as HTMLImageElement).naturalWidth;
  const originalHeight = (e.target as HTMLImageElement).naturalHeight;

  const [width, height] = calculateImageSize(originalWidth, originalHeight);

  const bounds = getBoundsFromSize(pos, width, height);

  let imageOverlay = Leaflet.imageOverlay(imageUrl, bounds, {
    interactive: true,
  })
    .on("mousedown", (e) => {
      if (e.originalEvent.button !== 0) return;
      imageOverlay.setOpacity(0.5);
      const zoom = battlemap.map.getZoom();
      const bounds = imageOverlay.getBounds();

      const southWest = battlemap.map.project(bounds.getSouthWest(), zoom);
      const northEast = battlemap.map.project(bounds.getNorthEast(), zoom);

      const widthPx = Math.abs(northEast.x - southWest.x);
      const heightPx = Math.abs(northEast.y - southWest.y);

      const icon = Leaflet.icon({
        iconUrl: imageUrl,
        iconSize: [widthPx, heightPx],
        iconAnchor: [widthPx / 2, heightPx / 2],
      });

      battlemap.tokens.draggingTokenMarker = Leaflet.marker(bounds.getCenter(), {
        icon,
        draggable: true,
        autoPan: true,
      }).addTo(battlemap.tokens.layer);

      battlemap.tokens.draggingTokenMarker.on("mouseup", (e) => {
        const bounds = getBoundsFromSize(e.latlng, width, height);

        imageOverlay.setOpacity(1);
        imageOverlay.setBounds(bounds);
        battlemap.tokens.draggingTokenMarker?.remove();
      });

      // @ts-ignore
      battlemap.tokens.draggingTokenMarker.dragging?._draggable._onDown(e.originalEvent);
    })
    .on("mouseover", (e) => {
      battlemap.map.dragging.disable();
    })
    .on("mouseout", (e) => {
      battlemap.map.dragging.enable();
    })
    .bringToFront()
    .addTo(battlemap.background.layer);
};

export const calculateTile = (pos: Leaflet.LatLng, battlemap: BattlemapInterface) => {
  const i = Math.max(
    0,
    Math.min(
      battlemap.grid.maxI,
      Math.floor((pos.lng + Math.abs(battlemap.grid.tiles[0][0].lng)) / battlemap.grid.deltaLng)
    )
  );
  const j = Math.max(
    0,
    Math.min(
      battlemap.grid.maxJ,
      Math.floor((pos.lat + Math.abs(battlemap.grid.tiles[0][0].lat)) / battlemap.grid.deltaLat)
    )
  );

  return battlemap.grid.tiles[i][j];
};

export const getBoundsFromData = (
  pos: Leaflet.LatLng,
  battlemap: BattlemapInterface,
  options?: { center: boolean }
) => {
  if (options?.center) {
    pos.lat -= battlemap.grid.deltaLat / 2;
    pos.lng -= battlemap.grid.deltaLng / 2;
  }

  const tile = calculateTile(pos, battlemap);

  const southWest = Leaflet.latLng(tile.lat, tile.lng);
  const northEast = Leaflet.latLng(
    tile.lat + battlemap.grid.deltaLat,
    tile.lng + battlemap.grid.deltaLng
  );

  return Leaflet.latLngBounds(southWest, northEast);
};

export const getBoundsFromSize = (
  pos: Leaflet.LatLng,
  width: number,
  height: number,
) => {
  const lat = pos.lat - (height / 2);
  const lng = pos.lng - (width / 2);

  const southWest = Leaflet.latLng(lat, lng);
  const northEast = Leaflet.latLng(
    lat + height,
    lng + width,
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


//! TODO
const calculateBackgroundImageSize = (originalWidth: number, originalHeight: number): [width: number, height: number, ratio: number] => {
  let ratio = 0;
  let width = 0;
  let height = 0;

  if (originalWidth > originalHeight) {
    ratio = originalHeight / originalWidth;
    width = Math.min(originalWidth, 2048) / 2048;
    height = width * ratio;
  } else if (originalHeight > originalWidth) {
    ratio = originalWidth / originalHeight;
    height = Math.min(originalHeight, 2048) / 2048;
    width = height * ratio;
  } else {
    ratio = 1;
    width = Math.min(originalWidth, 2048) / 2048;
    height = width;
  }

  return [width, height, ratio];
}

//! Magic number 2048
const calculateImageSize = (originalWidth: number, originalHeight: number): [width: number, height: number, ratio: number] => {
  let ratio = 0;
  let width = 0;
  let height = 0;

  if (originalWidth > originalHeight) {
    ratio = originalHeight / originalWidth;
    width = Math.min(originalWidth, 2048) / 2048;
    height = width * ratio;
  } else if (originalHeight > originalWidth) {
    ratio = originalWidth / originalHeight;
    height = Math.min(originalHeight, 2048) / 2048;
    width = height * ratio;
  } else {
    ratio = 1;
    width = Math.min(originalWidth, 2048) / 2048;
    height = width;
  }

  return [width, height, ratio];
}
