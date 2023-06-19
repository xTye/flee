import Leaflet, { imageOverlay } from "leaflet";

import { CharacterInterface } from "../types/CharacterType";

import {
  calculateBoundsFromGrid,
  calculateBoundsFromFree,
  calculateImageSize,
  calculateBackgroundImageBounds,
  calculateContainerPointsFromMap,
  calculateMapPointsFromContainer,
} from "./battlemap-utils/calculateUtil";

export const useRemoveCharacterImage = (
  battlemap: BattlemapInterface,
  token: TokenInterface
) => {
  if (token.border) battlemap.token.borderLayer.removeLayer(token.border);

  for (const [key, icon] of token.conditions) {
    battlemap.token.conditionsLayer.removeLayer(icon.overlay);
  }

  battlemap.token.layer.removeLayer(token.overlay);
  battlemap.token.tokens.delete(token.id);
};

export const useRemoveBackgroundImage = (
  battlemap: BattlemapInterface,
  asset: AssetInterface
) => {
  if (asset.border) battlemap.background.borderLayer.removeLayer(asset.border);

  battlemap.background.layer.removeLayer(asset.overlay);
  battlemap.background.assets.delete(asset.id);
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
  image.border?.setBounds(newBounds);

  // @ts-ignore
  manageTokenIcons(battlemap, image);
};

export const rotateImage = () => {};

export const useRemoveTokenCondition = (
  battlemap: BattlemapInterface,
  token: TokenInterface,
  type: ConditionType
) => {
  if (!token.conditions.has(type)) return;

  battlemap.token.conditionsLayer.removeLayer(
    token.conditions.get(type)?.overlay!
  );

  token.conditions.delete(type);

  manageTokenIcons(battlemap, token);
};

//! REMOVE
export function makeid(length: number) {
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
