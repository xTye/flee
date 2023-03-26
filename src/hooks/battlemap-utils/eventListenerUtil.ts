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
  image.overlay.on("mousedown", (e) => {
    if (e.originalEvent.button !== 0 || battlemap.events.dragging) return;

    battlemap.events.dragging = new Map<
      string,
      AssetInterface | TokenInterface
    >().set(image.id, image);

    //! This will stay like this until refactor to classes
    //@ts-ignore
    if (typeof image.characterId !== "string") {
      const selected = battlemap.background.selected();

      if (selected && selected.has(image.id))
        battlemap.events.dragging = selected;

      // This also should be an else if
    } else {
      const selected = battlemap.token.selected();

      if (selected && selected.has(image.id))
        battlemap.events.dragging = selected;
    }

    const boundsMap = new Map<
      string,
      {
        valueBounds: Leaflet.LatLngBounds;
        valueWidth: number;
        valueHeight: number;
        deltaLatLng: Leaflet.LatLng;
      }
    >();

    const zoom = battlemap.map.getZoom();
    const bounds = image.overlay.getBounds();

    const southWest = battlemap.map.project(bounds.getSouthWest(), zoom);
    const northEast = battlemap.map.project(bounds.getNorthEast(), zoom);

    const width = Math.abs(bounds.getEast() - bounds.getWest());
    const height = Math.abs(bounds.getNorth() - bounds.getSouth());

    const widthPx = Math.abs(northEast.x - southWest.x);
    const heightPx = Math.abs(northEast.y - southWest.y);

    for (const [key, value] of battlemap.events.dragging) {
      value.overlay.setOpacity(0.5);

      const valueBounds = value.overlay.getBounds();

      const [valueWidth, valueHeight] = [
        Math.abs(valueBounds.getEast() - valueBounds.getWest()),
        Math.abs(valueBounds.getNorth() - valueBounds.getSouth()),
      ];

      const deltaLatLng =
        image === value
          ? Leaflet.latLng(0, 0)
          : Leaflet.latLng(
              valueBounds.getSouthWest().lat - bounds.getSouthWest().lat,
              valueBounds.getSouthWest().lng - bounds.getSouthWest().lng
            );

      boundsMap.set(key, {
        valueBounds,
        valueWidth,
        valueHeight,
        deltaLatLng,
      });
    }

    const icon = Leaflet.icon({
      iconUrl: image.url,
      iconSize: [widthPx, heightPx],
      iconAnchor: [widthPx / 2, heightPx / 2],
    });

    image.dragMarker = Leaflet.marker(bounds.getCenter(), {
      icon,
      draggable: true,
      autoPan: true,
    }).addTo(battlemap.token.layer);

    image.dragMarker.on("mouseup", (e) => {
      if (e.originalEvent.button !== 0) return;
      let bounds: Leaflet.LatLngBounds;

      for (const [key, value] of battlemap.events.dragging!) {
        const { valueBounds, valueWidth, valueHeight, deltaLatLng } =
          boundsMap.get(key)!;

        const pos = new Leaflet.LatLng(e.latlng.lat, e.latlng.lng);

        pos.lat -= width / 2;
        pos.lng -= height / 2;

        pos.lat += deltaLatLng.lat;
        pos.lng += deltaLatLng.lng;

        if (image.movable.type === "grid") {
          bounds = calculateBoundsFromGrid(pos, battlemap, {
            scale: value.scale,
          });
        } else if (image.movable.type === "free") {
          bounds = calculateBoundsFromFree(pos, valueWidth, valueHeight);
        } else throw new Error("Image is not movable");

        value.overlay.setOpacity(1);
        value.overlay.setBounds(bounds);
      }

      image.dragMarker?.remove();

      image.dragMarker = undefined;
      battlemap.events.dragging = undefined;
    });

    //! This is a hack to get the marker to start dragging
    //! Assumes drag on the most recent marker created
    // @ts-ignore
    image.dragMarker.dragging?._draggable._onDown(e.originalEvent);
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
