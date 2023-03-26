import Leaflet from "leaflet";
import { Accessor, Setter } from "solid-js";

export interface AssetInterface {
  id: string;
  overlay: Leaflet.ImageOverlay;
  dragMarker?: Leaflet.Marker;
  url: string;
  movable: {
    type: MovableType;
    by: MovableByType;
  };
  scale: number;
  rotation: number;
}

export interface TokenInterface {
  id: string;
  characterId: string;
  overlay: Leaflet.ImageOverlay;
  dragMarker?: Leaflet.Marker;
  url: string;
  movable: {
    type: MovableType;
    by: MovableByType;
  };
  scale: number;
  rotation: number;
}

export interface ConditionIconInterface {
  tokenId: string;
  type: ConditionIconType;
  url: string;
  overlay: Leaflet.ImageOverlay;
}

export type TabType = "pages" | "background" | "grid" | "token" | "fog";
export type ImageOverlayType = "asset" | "token";
export type MovableType = "none" | "free" | "grid";
export type MovableByType = "all" | string;
export type ConditionIconType =
  | "dead"
  | "blinded"
  | "charmed"
  | "deafened"
  | "frightened"
  | "grappled"
  | "incapacitated"
  | "invisible"
  | "paralyzed"
  | "petrified"
  | "poisoned"
  | "prone"
  | "restrained"
  | "stunned"
  | "unconscious"
  | "exhaustion";

export const CONDITION_ICON_URL_IMAGES = {
  dead: "/battlemap-images/essentials/dead.png",
  blinded: "/battlemap-images/essentials/blinded.png",
  charmed: "/battlemap-images/essentials/charmed.png",
  deafened: "/battlemap-images/essentials/deafened.png",
  frightened: "/battlemap-images/essentials/frightened.png",
  grappled: "/battlemap-images/essentials/grappled.png",
  incapacitated: "/battlemap-images/essentials/incapacitated.png",
  invisible: "/battlemap-images/essentials/invisible.png",
  paralyzed: "/battlemap-images/essentials/paralyzed.png",
  petrified: "/battlemap-images/essentials/petrified.png",
  poisoned: "/battlemap-images/essentials/poisoned.png",
  prone: "/battlemap-images/essentials/prone.png",
  restrained: "/battlemap-images/essentials/restrained.png",
  stunned: "/battlemap-images/essentials/stunned.png",
  unconscious: "/battlemap-images/essentials/unconscious.png",
  exhaustion: "/battlemap-images/essentials/exhaustion.png",
};

export interface BattlemapDatabaseInterface {
  id: number;
  background: {
    url: string;
    assets: Map<string, AssetInterface>;
  };
  grid: {
    size: number;
  };
  tokens: Map<string, TokenInterface>;
}

export interface BattlemapInterface {
  map: Leaflet.Map;
  background: BackgroundLayerInterface;
  grid: GridLayerInterface;
  token: TokenLayerInterface;
  fog: FogLayerInterface;
  events: EventDataInterface;
}

export interface BackgroundLayerInterface {
  layer: Leaflet.LayerGroup;
  image: Leaflet.ImageOverlay;
  selected: Accessor<Map<string, AssetInterface> | undefined>;
  setSelected: Setter<Map<string, AssetInterface> | undefined>;
  assets: Map<string, AssetInterface>;
}

export interface GridLayerInterface {
  layer: Leaflet.GeoJSON;
  show: boolean;
  cellSize: number;
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

export interface TokenLayerInterface {
  layer: Leaflet.LayerGroup;
  conditionIconLayer: Leaflet.LayerGroup;
  selected: Accessor<Map<string, TokenInterface> | undefined>;
  setSelected: Setter<Map<string, TokenInterface> | undefined>;
  tokens: Map<string, TokenInterface>;
  conditionIcons: Map<string, Map<string, ConditionIconInterface>>;
}

export interface FogLayerInterface {
  layer: Leaflet.LayerGroup;
  blob?: Blob;
  image?: Leaflet.ImageOverlay;
}

export interface EventDataInterface {
  tab: TabType;
  dragging?: Map<string, TokenInterface | AssetInterface>;
}

interface GetSet<T> {}
