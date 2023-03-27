import Leaflet from "leaflet";

import {
  AssetInterface,
  BattlemapInterface,
  TokenInterface,
} from "../../types/BattlemapType";
import { KonvaInterface } from "../../types/KonvaType";
import { isFogLayerActive } from "./booleanRelationshipsUtil";
import { calculateContainerPointsFromMap } from "./calculateUtil";

export const selectAssets = (
  battlemap: BattlemapInterface,
  konva: KonvaInterface
) => {
  if (konva.e.shiftKey && konva.e.ctrlKey) return;

  const prevAssets = battlemap.background.selected();
  const assets: Map<string, AssetInterface> = new Map<string, AssetInterface>();
  let latlng: Leaflet.LatLngExpression | undefined;
  let singleAsset: AssetInterface | undefined;

  // If the user is not dragging, then we need to check if the user is clicking
  if (!konva.dragged) {
    latlng = battlemap.map.containerPointToLatLng([
      konva.start.x,
      konva.start.y,
    ]);
  }

  // Iterate through the assets
  for (const [key, asset] of battlemap.background.assets) {
    // If the ctrl key is pressed, then we need to add the previous tokens to the selection
    if (konva.e.ctrlKey && prevAssets) {
      if (prevAssets.has(asset.id)) {
        assets.set(asset.id, asset);
        continue;
      }
    }

    if (konva.e.shiftKey && prevAssets) {
      if (prevAssets.has(asset.id)) {
        assets.set(asset.id, asset);
      }
    }

    const bounds = asset.overlay.getBounds();

    if (konva.dragged) {
      const northEast = battlemap.map.latLngToContainerPoint(
        bounds.getNorthEast()
      );
      const northWest = battlemap.map.latLngToContainerPoint(
        bounds.getNorthWest()
      );
      const southEast = battlemap.map.latLngToContainerPoint(
        bounds.getSouthEast()
      );
      const southWest = battlemap.map.latLngToContainerPoint(
        bounds.getSouthWest()
      );

      // If this gets bad, use stage.getInstersection()
      if (
        konva.shape.intersects(northEast) ||
        konva.shape.intersects(northWest) ||
        konva.shape.intersects(southEast) ||
        konva.shape.intersects(southWest)
      )
        if (konva.e.shiftKey) assets.delete(asset.id);
        else assets.set(asset.id, asset);
    } else if (latlng) {
      // If we didn't drag, then we need to check if the user clicked on a asset
      if (bounds.contains(latlng)) singleAsset = asset;
    }
  }

  if (singleAsset) {
    if (konva.e.shiftKey) assets.delete(singleAsset.id);
    else assets.set(singleAsset.id, singleAsset);
  }

  if (assets.size === 0) battlemap.background.setSelected();
  else battlemap.background.setSelected(assets);
};

export const selectTokens = (
  battlemap: BattlemapInterface,
  konva: KonvaInterface
) => {
  if (konva.e.shiftKey && konva.e.ctrlKey) return;

  const prevTokens = battlemap.token.selected();
  const tokens: Map<string, TokenInterface> = new Map<string, TokenInterface>();
  let latlng: Leaflet.LatLngExpression | undefined;
  let singleToken: TokenInterface | undefined;

  // If the user is not dragging, then we need to check if the user is clicking
  if (!konva.dragged) {
    latlng = battlemap.map.containerPointToLatLng([
      konva.start.x,
      konva.start.y,
    ]);
  }

  // Iterate through the tokens
  for (const [key, token] of battlemap.token.tokens) {
    // If the ctrl key is pressed, then we need to add the previous tokens to the selection
    if (konva.e.ctrlKey && prevTokens) {
      if (prevTokens.has(token.id)) {
        tokens.set(token.id, token);
        continue;
      }
    }

    if (konva.e.shiftKey && prevTokens) {
      if (prevTokens.has(token.id)) {
        tokens.set(token.id, token);
      }
    }

    const bounds = token.overlay.getBounds();

    if (konva.dragged) {
      const northEast = battlemap.map.latLngToContainerPoint(
        bounds.getNorthEast()
      );
      const northWest = battlemap.map.latLngToContainerPoint(
        bounds.getNorthWest()
      );
      const southEast = battlemap.map.latLngToContainerPoint(
        bounds.getSouthEast()
      );
      const southWest = battlemap.map.latLngToContainerPoint(
        bounds.getSouthWest()
      );

      // If this gets bad, use stage.getInstersection()
      if (
        konva.shape.intersects(northEast) ||
        konva.shape.intersects(northWest) ||
        konva.shape.intersects(southEast) ||
        konva.shape.intersects(southWest)
      )
        if (konva.e.shiftKey) tokens.delete(token.id);
        else tokens.set(token.id, token);
    } else if (latlng) {
      // If we didn't drag, then we need to check if the user clicked on a token
      if (bounds.contains(latlng)) singleToken = token;
    }
  }

  if (singleToken) {
    if (konva.e.shiftKey) tokens.delete(singleToken.id);
    else tokens.set(singleToken.id, singleToken);
  }

  if (prevTokens) {
    for (const [key, token] of prevTokens) {
      if (tokens.has(key)) continue;

      if (token.border) {
        token.border.remove();
        token.border = undefined;
      }
    }
  }

  for (const [key, token] of tokens) {
    if (prevTokens && prevTokens.has(token.id)) continue;

    token.border = new Leaflet.Rectangle(token.overlay.getBounds(), {
      color: "#0000ff",
      weight: 1,
      interactive: false,
    }).addTo(battlemap.token.borderLayer);
  }

  if (tokens.size === 0) battlemap.token.setSelected();
  else battlemap.token.setSelected(tokens);
};

export const changeFog = (
  battlemap: BattlemapInterface,
  konva: KonvaInterface
) => {
  if (!isFogLayerActive(battlemap)) return;
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (battlemap.fog.blob) {
    const image = new Image();
    image.src = URL.createObjectURL(battlemap.fog.blob);
    image.onload = () => {
      ctx.drawImage(image, 0, 0);

      addFogCallback(battlemap, konva, canvas, ctx);
    };

    return;
  }

  addFogCallback(battlemap, konva, canvas, ctx);
};

const addFogCallback = (
  battlemap: BattlemapInterface,
  konva: KonvaInterface,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  const { topLeft, bottomRight } = calculateContainerPointsFromMap(battlemap);
  const width = bottomRight.x - topLeft.x;
  const scale = canvas.width / width;

  if (konva.e.shiftKey) ctx.globalCompositeOperation = "destination-out";
  else ctx.globalCompositeOperation = "source-over";

  ctx.scale(scale, scale);
  ctx.drawImage(konva.canvas, -topLeft.x, -topLeft.y);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const imageUrl = URL.createObjectURL(blob);
    battlemap.fog.blob = blob;

    const prev = battlemap.fog.image;

    battlemap.fog.image = Leaflet.imageOverlay(
      imageUrl,
      battlemap.map.options.maxBounds!,
      {
        opacity: 0.5,
      }
    )
      .bringToFront()
      .addTo(battlemap.fog.layer);

    if (prev) battlemap.fog.layer.removeLayer(prev);
  });
};
