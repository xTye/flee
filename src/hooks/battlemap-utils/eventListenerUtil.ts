import Leaflet from "leaflet";
import {
  AssetInterface,
  BattlemapInterface,
  TokenInterface,
} from "../../types/BattlemapType";
import {
  calculateBoundsFromGrid,
  calculateBoundsFromFree,
} from "./calculateUtil";

export const addImageOverlayMoveListener = (
  battlemap: BattlemapInterface,
  image: AssetInterface | TokenInterface
) => {
  const imageOverlay = image.overlay;

  imageOverlay.on("mousedown", (e) => {
    if (e.originalEvent.button !== 0 || battlemap.events.dragging) return;
    battlemap.token.draggingTokenImage = imageOverlay;
    imageOverlay.setOpacity(0.5);

    const zoom = battlemap.map.getZoom();
    const bounds = imageOverlay.getBounds();

    const southWest = battlemap.map.project(bounds.getSouthWest(), zoom);
    const northEast = battlemap.map.project(bounds.getNorthEast(), zoom);

    const [width, height] = [
      Math.abs(bounds.getEast() - bounds.getWest()),
      Math.abs(bounds.getNorth() - bounds.getSouth()),
    ];

    const widthPx = Math.abs(northEast.x - southWest.x);
    const heightPx = Math.abs(northEast.y - southWest.y);

    const icon = Leaflet.icon({
      iconUrl: image.url,
      iconSize: [widthPx, heightPx],
      iconAnchor: [widthPx / 2, heightPx / 2],
    });

    battlemap.token.draggingTokenMarker = Leaflet.marker(bounds.getCenter(), {
      icon,
      draggable: true,
      autoPan: true,
    }).addTo(battlemap.token.layer);

    battlemap.token.draggingTokenMarker.on("mouseup", (e) => {
      if (e.originalEvent.button !== 0) return;
      let bounds: Leaflet.LatLngBounds;

      if (image.movable.type === "grid") {
        const pos = e.latlng;
        pos.lat -= width / 2;
        pos.lng -= height / 2;

        bounds = calculateBoundsFromGrid(pos, battlemap, {
          scale: image.scale,
        });
      } else if (image.movable.type === "free") {
        bounds = calculateBoundsFromFree(e.latlng, width, height);
      } else throw new Error("Image is not movable");

      imageOverlay.setOpacity(1);
      imageOverlay.setBounds(bounds);
      battlemap.token.draggingTokenMarker?.remove();

      battlemap.token.draggingTokenImage = undefined;
      battlemap.token.draggingTokenMarker = undefined;
    });

    //! This is a hack to get the marker to start dragging
    //! Assumes drag on the most recent marker created
    // @ts-ignore
    battlemap.token.draggingTokenMarker.dragging?._draggable._onDown(
      e.originalEvent
    );
  });
};

export const addImageOverlayMouseOverListener = (
  battlemap: BattlemapInterface,
  image: AssetInterface | TokenInterface
) => {
  image.overlay.on("mouseover", (e) => {
    battlemap.map.dragging.disable();
  });
};

export const addImageOverlayMouseOutListener = (
  battlemap: BattlemapInterface,
  image: AssetInterface | TokenInterface
) => {
  image.overlay.on("mouseout", (e) => {
    battlemap.map.dragging.enable();
  });
};

export const addAssetContextMenuListener = (
  battlemap: BattlemapInterface,
  asset: AssetInterface
) => {
  asset.overlay.on("contextmenu", (e) => {
    //battlemap.background.setSelected(asset);
  });
};

export const addTokenContextMenuListener = (
  battlemap: BattlemapInterface,
  token: TokenInterface
) => {
  token.overlay.on("contextmenu", (e) => {
    //battlemap.token.setSelected(token);
  });
};

export const removeImageOverlayMoveListener = (image: TokenInterface) => {
  image.overlay.off("mousedown");
};

export const removeImageOverlayMouseOverListener = (image: TokenInterface) => {
  image.overlay.off("mouseover");
};

export const removeImageOverlayMouseOutListener = (image: TokenInterface) => {
  image.overlay.off("mouseout");
};

export const removeAssetContextMenuListener = (asset: AssetInterface) => {
  asset.overlay.off("contextmenu");
};

export const removeTokenContextMenuListener = (token: TokenInterface) => {
  token.overlay.off("contextmenu");
};
