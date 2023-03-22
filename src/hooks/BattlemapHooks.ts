import Leaflet from "leaflet";
import * as Turf from "@turf/turf";
import { CharacterInterface } from "../types/CharacterType";
import {
  AssetInterface,
  BattlemapInterface,
  GridLayerInterface,
  TokenInterface,
} from "../types/BattlemapType";
import {
  calculateBoundsFromGrid,
  calculateBoundsFromFree,
  calculateImageSize,
} from "./battlemap-utils/calculateUtil";
import {
  addAssetContextMenuListener,
  addImageOverlayMouseOutListener,
  addImageOverlayMouseOverListener,
  addImageOverlayMoveListener,
  addTokenContextMenuListener,
} from "./battlemap-utils/eventListenerUtil";
import { createSignal } from "solid-js";

const maxBounds = [
  [-1, -1],
  [1, 1],
];

export const useBattlemap = (
  div: HTMLDivElement,
  battlemap: BattlemapInterface
) => {
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
    if (
      battlemap.token.draggingTokenMarker &&
      battlemap.token.draggingTokenImage
    ) {
      battlemap.token.draggingTokenImage.setOpacity(1);
      battlemap.token.draggingTokenMarker.remove();

      battlemap.token.draggingTokenImage = undefined;
      battlemap.token.draggingTokenMarker = undefined;
    }
  });

  return map;
};

export const useBackgroundLayer = (battlemap: BattlemapInterface) => {
  const layer = Leaflet.layerGroup().addTo(battlemap.map);

  const image = Leaflet.imageOverlay(
    "/maps/lowres-maps/Daggerfalls.jpg",
    battlemap.map.options.maxBounds!
  )
    .bringToFront()
    .addTo(layer);

  const [selected, setSelected] = createSignal<AssetInterface>();

  return {
    layer,
    image,
    selected,
    setSelected,
    assets: new Map(),
  };
};

export const useGridLayer = (battlemap: BattlemapInterface, cellSize = 10) => {
  // @ts-ignore
  const bounds = Leaflet.latLngBounds(battlemap.map.options.maxBounds!);
  const gridTurf = Turf.squareGrid(
    [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    cellSize,
    {
      units: "kilometers",
    }
  );

  const grid: GridLayerInterface = {
    layer: new Leaflet.GeoJSON(),
    cellSize,
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
        j = -1;
      }
      j++;

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

  const [selected, setSelected] = createSignal<TokenInterface>();

  return {
    layer,
    selected,
    setSelected,
    tokens: new Map(),
  };
};

export const useFogLayer = (battlemap: BattlemapInterface) => {
  const layer = Leaflet.layerGroup().addTo(battlemap.map);

  return {
    layer,
  };
};

export const useCreateCharacterImage = (
  e: DragEvent,
  character: CharacterInterface,
  battlemap: BattlemapInterface
) => {
  const pos = battlemap.map.mouseEventToLatLng(e);
  const bounds = calculateBoundsFromGrid(pos, battlemap);

  const imageOverlay = Leaflet.imageOverlay(character.image, bounds, {
    interactive: true,
  })
    .bringToFront()
    .addTo(battlemap.token.layer);

  const token: TokenInterface = {
    id: makeid(10),
    characterId: character.id,
    overlay: imageOverlay,
    url: character.image,
    movable: {
      type: "grid",
      by: "all",
    },
    scale: 1,
    rotation: 0,
  };

  //TODO Change with permissions
  addImageOverlayMoveListener(battlemap, token);
  addImageOverlayMouseOverListener(battlemap, token);
  addImageOverlayMouseOutListener(battlemap, token);
  addTokenContextMenuListener(battlemap, token);

  battlemap.token.tokens.set(token.id, token);
};

export const useCreateBackgroundImage = (
  e: DragEvent,
  battlemap: BattlemapInterface
) => {
  const pos = battlemap.map.mouseEventToLatLng(e);

  const imageUrl = (e.target as HTMLImageElement).currentSrc;

  const originalWidth = (e.target as HTMLImageElement).naturalWidth;
  const originalHeight = (e.target as HTMLImageElement).naturalHeight;

  const [width, height] = calculateImageSize(originalWidth, originalHeight);

  const bounds = calculateBoundsFromFree(pos, width, height);

  const imageOverlay = Leaflet.imageOverlay(imageUrl, bounds, {
    interactive: true,
  })
    .bringToFront()
    .addTo(battlemap.background.layer);

  const asset: AssetInterface = {
    id: makeid(10),
    overlay: imageOverlay,
    url: imageUrl,
    bounds: bounds,
    movable: {
      type: "free",
      by: "admin",
    },
    scale: 1,
    rotation: 0,
  };

  //TODO Change with permissions
  addImageOverlayMoveListener(battlemap, asset);
  addImageOverlayMouseOverListener(battlemap, asset);
  addImageOverlayMouseOutListener(battlemap, asset);
  addAssetContextMenuListener(battlemap, asset);

  battlemap.background.assets.set(asset.id, asset);
};

export const toggleGrid = (battlemap: BattlemapInterface, on: boolean) => {
  if (on && battlemap.map.hasLayer(battlemap.grid.layer)) return;

  if (on) battlemap.grid.layer.addTo(battlemap.map);
  else battlemap.grid.layer.removeFrom(battlemap.map);
};

export const resizeImage = (
  battlemap: BattlemapInterface,
  image: AssetInterface | TokenInterface
) => {
  const { overlay, scale } = image;
  const bounds = overlay.getBounds();
  const pos = bounds.getSouthWest();

  pos.lat = pos.lat + battlemap.grid.deltaLat / 2;
  pos.lng = pos.lng + battlemap.grid.deltaLng / 2;

  let newBounds: Leaflet.LatLngBounds;

  if (image.movable.type === "grid") {
    newBounds = calculateBoundsFromGrid(pos, battlemap, scale);
  } else {
    const [width, height] = [
      Math.abs(bounds.getEast() - bounds.getWest()),
      Math.abs(bounds.getNorth() - bounds.getSouth()),
    ];
    newBounds = calculateBoundsFromFree(
      bounds.getSouthWest(),
      width,
      height,
      scale
    );
  }

  overlay.setBounds(newBounds);
};

//! REMOVE
function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
