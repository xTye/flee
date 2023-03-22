import Leaflet from "leaflet";
import { Accessor, Setter, Signal } from "solid-js";

export interface AssetInterface {
  id: string;
  overlay: Leaflet.ImageOverlay;
  url: string;
  bounds: Leaflet.LatLngBounds;
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
  url: string;
  movable: {
    type: MovableType;
    by: MovableByType;
  };
  scale: number;
  rotation: number;
}

export type ImageOverlayType = "asset" | "token";
export type MovableType = "none" | "free" | "grid";
type MovableByType = "none" | "all" | string;

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
}

export interface BackgroundLayerInterface {
  layer: Leaflet.LayerGroup;
  image: Leaflet.ImageOverlay;
  selected: Accessor<AssetInterface | undefined>;
  setSelected: Setter<AssetInterface | undefined>;
  assets: Map<string, AssetInterface>;
}

export interface GridLayerInterface {
  layer: Leaflet.GeoJSON;
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
  draggingTokenImage?: Leaflet.ImageOverlay;
  draggingTokenMarker?: Leaflet.Marker;
  selected: Accessor<TokenInterface | undefined>;
  setSelected: Setter<TokenInterface | undefined>;
  tokens: Map<string, TokenInterface>;
}

export interface FogLayerInterface {
  layer: Leaflet.LayerGroup;
}
