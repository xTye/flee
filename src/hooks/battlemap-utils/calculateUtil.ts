import Leaflet from "leaflet";
import { BattlemapInterface } from "../../types/BattlemapType";

const maxImageSize = 2048;

// TODO
export const calculateBackgroundImageSize = (
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
  scale = 1
) => {
  const tile = calculateTile(pos, battlemap);
  console.log(tile, pos);

  const southWest = Leaflet.latLng(tile.lat, tile.lng);
  const northEast = Leaflet.latLng(
    tile.lat + battlemap.grid.deltaLat * scale,
    tile.lng + battlemap.grid.deltaLng * scale
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
  battlemap: BattlemapInterface
) => {
  const i = Math.max(
    0,
    Math.min(
      battlemap.grid.maxI,
      Math.floor(
        (pos.lng + Math.abs(battlemap.grid.tiles[0][0].lng)) /
          battlemap.grid.deltaLng
      )
    )
  );
  const j = Math.max(
    0,
    Math.min(
      battlemap.grid.maxJ,
      Math.floor(
        (pos.lat + Math.abs(battlemap.grid.tiles[0][0].lat)) /
          battlemap.grid.deltaLat
      )
    )
  );

  return battlemap.grid.tiles[i][j];
};
