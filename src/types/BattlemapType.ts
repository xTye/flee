import Leaflet from "leaflet";

export interface BattlemapInterface {
  map: Leaflet.Map;
  background: BackgroundLayerInterface;
  tokens: TokenLayerInterface;
  grid: GridLayerInterface;
}

export interface BackgroundLayerInterface {
  layer: Leaflet.LayerGroup;
  image: Leaflet.ImageOverlay;
}

export interface GridLayerInterface {
  layer: Leaflet.GeoJSON;
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
}
