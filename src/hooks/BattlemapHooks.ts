import Leaflet, { imageOverlay } from "leaflet";
import * as Turf from "@turf/turf";
import { CharacterInterface } from "../types/CharacterType";
import {
  AssetInterface,
  BattlemapInterface,
  EventDataInterface,
  GridLayerInterface,
  TokenInterface,
  TokenLayerInterface,
} from "../types/BattlemapType";
import {
  calculateBoundsFromGrid,
  calculateBoundsFromFree,
  calculateImageSize,
  calculateBackgroundImageBounds,
  calculateContainerPointsFromMap,
  calculateMapPointsFromContainer,
} from "./battlemap-utils/calculateUtil";
import {
  addAssetContextMenuListener,
  addImageOverlayMouseOutListener,
  addImageOverlayMouseOverListener,
  addImageOverlayMoveListener,
  addTokenContextMenuListener,
} from "./battlemap-utils/eventListenerUtil";
import { createSignal } from "solid-js";
import { ImageInterface } from "../types/ImageType";
import { KonvaInterface } from "../types/KonvaType";
import { isFogLayerActive } from "./battlemap-utils/booleanRelationshipsUtil";

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
    zoomAnimation: false,
  });

  map.zoomControl.setPosition("bottomright");

  map.on("zoomstart", (e) => {
    if (battlemap.events.dragging) {
      for (const [key, value] of battlemap.events.dragging) {
        value.overlay.setOpacity(1);

        value.dragMarker?.remove();
        value.dragMarker = undefined;
        battlemap.events.dragging = undefined;
      }
    }
  });

  map.on("mousedown", (e) => {
    if (e.originalEvent && e.originalEvent.button === 2) return;
  });

  map.on("mouseup", (e) => {});

  return map;
};

export const useBackgroundLayer = (battlemap: BattlemapInterface) => {
  const layer = Leaflet.layerGroup().addTo(battlemap.map);

  const image = Leaflet.imageOverlay(
    "https://firebasestorage.googleapis.com/v0/b/flee-website.appspot.com/o/battlemap%2Fmaps%2Fgreen-forest-1?alt=media&token=ca9c2e6a-f050-4026-bb3e-1eb251de760b",
    battlemap.map.options.maxBounds!
  )
    .bringToFront()
    .addTo(layer);

  const [selected, setSelected] = createSignal<Map<string, AssetInterface>>();

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
    show: true,
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

export const useTokenLayer = (
  battlemap: BattlemapInterface
): TokenLayerInterface => {
  const layer = Leaflet.layerGroup().addTo(battlemap.map);
  const conditionIconLayer = Leaflet.layerGroup().addTo(battlemap.map);

  const [selected, setSelected] = createSignal<Map<string, TokenInterface>>();

  return {
    layer,
    conditionIconLayer,
    selected,
    setSelected,
    tokens: new Map(),
    conditionIcons: new Map(),
  };
};

export const useFogLayer = (battlemap: BattlemapInterface) => {
  const layer = Leaflet.layerGroup().addTo(battlemap.map);

  return {
    layer,
  };
};

export const useEvents = (
  battlemap: BattlemapInterface
): EventDataInterface => {
  return {
    tab: "pages",
  };
};

export const changeBackgroundImage = (
  battlemap: BattlemapInterface,
  backgroundImage: ImageInterface
) => {
  const { width, height } = backgroundImage.customMetadata;

  const widthNum = Number.parseFloat(width);
  const heightNum = Number.parseFloat(height);

  const { bounds } = calculateBackgroundImageBounds(widthNum, heightNum);

  battlemap.background.image.setUrl(backgroundImage.url);
  battlemap.background.image.setBounds(bounds);
};

export const useCreateCharacterImage = (
  e: DragEvent,
  character: CharacterInterface,
  battlemap: BattlemapInterface
) => {
  const pos = battlemap.map.mouseEventToLatLng(e);
  const bounds = calculateBoundsFromGrid(pos, battlemap, { mousePos: true });

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
  battlemap: BattlemapInterface,
  backgroundImage: ImageInterface
) => {
  const pos = battlemap.map.mouseEventToLatLng(e);

  const imageUrl = backgroundImage.url;

  const originalWidth = Number.parseFloat(backgroundImage.customMetadata.width);
  const originalHeight = Number.parseFloat(
    backgroundImage.customMetadata.height
  );

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

export const toggleFog = (battlemap: BattlemapInterface, on: boolean) => {
  if (on && battlemap.map.hasLayer(battlemap.fog.layer)) return;

  if (on) battlemap.fog.layer.addTo(battlemap.map);
  else battlemap.fog.layer.removeFrom(battlemap.map);
};

export const resizeImage = (
  battlemap: BattlemapInterface,
  image: AssetInterface | TokenInterface
) => {
  const { overlay, scale } = image;
  const bounds = overlay.getBounds();
  const pos = bounds.getSouthWest();

  let newBounds: Leaflet.LatLngBounds;

  if (image.movable.type === "grid") {
    newBounds = calculateBoundsFromGrid(pos, battlemap, { scale });
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

export const rotateImage = () => {};

export const useCreateTokenIcon = (
  battlemap: BattlemapInterface,
  token: TokenInterface
) => {
  const bounds = token.overlay.getBounds();

  const northEast = bounds.getNorthEast();
  const southWest = bounds.getNorthEast();
  const iconBounds = Leaflet.latLngBounds(
    [
      southWest.lat - battlemap.grid.deltaLat / 4,
      southWest.lng - battlemap.grid.deltaLng / 4,
    ],
    northEast
  );

  const icon = Leaflet.imageOverlay(
    "/campaign-images/logo-edited.png",
    iconBounds
  )
    .bringToFront()
    .addTo(battlemap.token.conditionIconLayer);
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
