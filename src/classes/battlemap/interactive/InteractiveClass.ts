import Leaflet from "leaflet";
import { BattlemapClass } from "../BattlemapClass";
import {
  calculateBoundsFromFree,
  calculateBoundsFromGrid,
} from "@/hooks/battlemap-utils/calculateUtil";
import { Accessor } from "solid-js";
import { TokenInteractiveClass } from "./TokenInteractiveClass";

export abstract class InteractiveClass {
  // Required properties
  abstract get battlemap(): BattlemapClass;
  abstract get id(): string;
  abstract get overlay(): Leaflet.ImageOverlay;
  abstract get border(): Leaflet.Rectangle | undefined;
  abstract get dragMarker(): Leaflet.Marker | undefined;
  abstract set dragMarker(marker: Leaflet.Marker | undefined);
  abstract get url(): string;
  abstract get movable(): {
    type: MovableType;
    by: MovableByType;
  };
  abstract get scale(): number;
  abstract get rotation(): number;

  // Required methods
  abstract resizeImage(): void;
  abstract destruct(): void;

  // Abstractable, fast accessors
  abstract get selected(): Accessor<Map<string, InteractiveClass> | undefined>;

  addImageOverlayMoveListener() {
    this.overlay.on("mousedown", (e) => {
      if (e.originalEvent.button !== 0 || this.battlemap.events.dragging)
        return;

      this.battlemap.events.dragging = new Map<string, InteractiveClass>().set(
        this.id,
        this
      );

      const selected = this.selected();

      if (selected && selected.has(this.id))
        this.battlemap.events.dragging = selected;

      const boundsMap = new Map<
        string,
        {
          valueBounds: Leaflet.LatLngBounds;
          valueWidth: number;
          valueHeight: number;
          deltaLatLng: Leaflet.LatLng;
        }
      >();

      const zoom = this.battlemap.map.getZoom();
      const bounds = this.overlay.getBounds();

      const southWest = this.battlemap.map.project(bounds.getSouthWest(), zoom);
      const northEast = this.battlemap.map.project(bounds.getNorthEast(), zoom);

      const width = Math.abs(bounds.getEast() - bounds.getWest());
      const height = Math.abs(bounds.getNorth() - bounds.getSouth());

      const widthPx = Math.abs(northEast.x - southWest.x);
      const heightPx = Math.abs(northEast.y - southWest.y);

      for (const [key, value] of this.battlemap.events.dragging) {
        value.overlay.setOpacity(0.5);

        const valueBounds = value.overlay.getBounds();

        const [valueWidth, valueHeight] = [
          Math.abs(valueBounds.getEast() - valueBounds.getWest()),
          Math.abs(valueBounds.getNorth() - valueBounds.getSouth()),
        ];

        const deltaLatLng =
          this === value
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
        iconUrl: this.url,
        iconSize: [widthPx, heightPx],
        iconAnchor: [widthPx / 2, heightPx / 2],
      });

      this.dragMarker = Leaflet.marker(bounds.getCenter(), {
        icon,
        draggable: true,
        autoPan: true,
      }).addTo(this.battlemap.token.layer);

      this.dragMarker.on("mouseup", (e) => {
        if (e.originalEvent.button !== 0) return;
        let bounds: Leaflet.LatLngBounds;

        for (const [key, value] of this.battlemap.events.dragging!) {
          const { valueBounds, valueWidth, valueHeight, deltaLatLng } =
            boundsMap.get(key)!;

          const pos = new Leaflet.LatLng(e.latlng.lat, e.latlng.lng);

          pos.lat -= width / 2;
          pos.lng -= height / 2;

          pos.lat += deltaLatLng.lat;
          pos.lng += deltaLatLng.lng;

          if (this.movable.type === "grid") {
            bounds = calculateBoundsFromGrid(pos, this.battlemap, {
              scale: value.scale,
            });
          } else if (this.movable.type === "free") {
            bounds = calculateBoundsFromFree(pos, valueWidth, valueHeight);
          } else throw new Error("Image is not movable");

          value.overlay.setOpacity(1);

          value.overlay.setBounds(bounds);

          value.border?.setBounds(bounds);

          // @ts-ignore
          value.conditions?.manageTokenIcons();
        }

        this.dragMarker?.remove();

        this.dragMarker = undefined;
        this.battlemap.events.dragging = undefined;
      });

      //! This is a hack to get the marker to start dragging
      //! Assumes drag on the most recent marker created
      // @ts-ignore
      this.dragMarker.dragging?._draggable._onDown(e.originalEvent);
    });
  }

  addImageOverlayMouseOverListener() {
    this.overlay.on("mouseover", (e) => {
      this.battlemap.map.dragging.disable();
    });
  }

  addImageOverlayMouseOutListener() {
    this.overlay.on("mouseout", (e) => {
      this.battlemap.map.dragging.enable();
    });
  }

  addContextMenuListener() {
    this.overlay.on("contextmenu", (e) => {
      //battlemap.background.setSelected(asset);
    });
  }

  removeMouseDownListener() {
    this.overlay.off("mousedown");
  }

  removeMouseOverListener() {
    this.overlay.off("mouseover");
  }

  removeMouseOutListener() {
    this.overlay.off("mouseout");
  }

  removeContextMenuListener() {
    this.overlay.off("contextmenu");
  }
}

export type ImageOverlayType = "asset" | "token";
export type MovableType = "none" | "free" | "grid";
export type MovableByType = "all" | string;
