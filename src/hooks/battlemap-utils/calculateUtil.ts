import Leaflet from "leaflet";
import { BattlemapInterface } from "../../types/BattlemapType";

const maxImageSize = 2048;

export const calculateBackgroundImageBounds = (
  originalWidth: number,
  originalHeight: number
) => {
  let ratio = 0;
  let width = 0;
  let height = 0;

  let southWest: Leaflet.LatLng;
  let northEast: Leaflet.LatLng;

  if (originalWidth > originalHeight) {
    ratio = originalHeight / originalWidth;
    width = Math.min(originalWidth, maxImageSize) / maxImageSize;
    height = width * ratio;
    southWest = Leaflet.latLng(-ratio, -1);
    northEast = Leaflet.latLng(ratio, 1);
  } else if (originalHeight > originalWidth) {
    ratio = originalWidth / originalHeight;
    height = Math.min(originalHeight, maxImageSize) / maxImageSize;
    width = height * ratio;
    southWest = Leaflet.latLng(-1, -ratio);
    northEast = Leaflet.latLng(1, ratio);
  } else {
    ratio = 1;
    width = Math.min(originalWidth, maxImageSize) / maxImageSize;
    height = width;
    southWest = Leaflet.latLng(-1, -1);
    northEast = Leaflet.latLng(1, 1);
  }

  const bounds = Leaflet.latLngBounds(southWest, northEast);

  return { width, height, ratio, southWest, northEast, bounds };
};

export const calculateImageSize = (
  originalWidth: number,
  originalHeight: number
): [width: number, height: number, ratio: number] => {
  let ratio = 0;
  let width = 0;
  let height = 0;

  if (originalWidth > originalHeight) {
    ratio = originalHeight / originalWidth;
    width = Math.min(originalWidth, maxImageSize) / maxImageSize;
    height = width * ratio;
  } else if (originalHeight > originalWidth) {
    ratio = originalWidth / originalHeight;
    height = Math.min(originalHeight, maxImageSize) / maxImageSize;
    width = height * ratio;
  } else {
    ratio = 1;
    width = Math.min(originalWidth, maxImageSize) / maxImageSize;
    height = width;
  }

  return [width, height, ratio];
};

export const calculateBoundsFromGrid = (
  pos: Leaflet.LatLng,
  battlemap: BattlemapInterface,
  options?: { scale?: number; mousePos?: boolean }
) => {
  const mousePos = options?.mousePos ? options.mousePos : undefined;

  const tile = calculateTile(pos, battlemap, mousePos && { mousePos });

  const southWest = Leaflet.latLng(tile.lat, tile.lng);
  const northEast = Leaflet.latLng(
    tile.lat + battlemap.grid.deltaLat * (options?.scale ? options.scale : 1),
    tile.lng + battlemap.grid.deltaLng * (options?.scale ? options.scale : 1)
  );

  return Leaflet.latLngBounds(southWest, northEast);
};

export const calculateBoundsFromFree = (
  pos: Leaflet.LatLng,
  width: number,
  height: number,
  scale = 1
) => {
  const lat = pos.lat - height / 2;
  const lng = pos.lng - width / 2;

  const southWest = Leaflet.latLng(lat, lng);
  const northEast = Leaflet.latLng(lat + height * scale, lng + width * scale);

  return Leaflet.latLngBounds(southWest, northEast);
};

export const calculateTile = (
  pos: Leaflet.LatLng,
  battlemap: BattlemapInterface,
  options?: { mousePos?: boolean }
) => {
  const calc = options?.mousePos ? Math.floor : Math.round;

  const i = Math.max(
    0,
    Math.min(
      battlemap.grid.maxI,
      calc(
        (pos.lng + Math.abs(battlemap.grid.tiles[0][0].lng)) /
          battlemap.grid.deltaLng
      )
    )
  );
  const j = Math.max(
    0,
    Math.min(
      battlemap.grid.maxJ,
      calc(
        (pos.lat + Math.abs(battlemap.grid.tiles[0][0].lat)) /
          battlemap.grid.deltaLat
      )
    )
  );

  return battlemap.grid.tiles[i][j];
};
