import Leaflet from "leaflet";

import { BattlemapClass } from "../BattlemapClass";
import {
  calculateBoundsFromFree,
  calculateImageSize,
} from "../../../hooks/battlemap-utils/calculateUtil";
import { ImageInterface } from "../../../types/ImageType";
import {
  InteractiveClass,
  MovableByType,
  MovableType,
} from "./InteractiveClass";
import { makeid } from "../../../utils/makeid";
import { Accessor } from "solid-js";

export class AssetInteractiveClass extends InteractiveClass {
  private _battlemap: BattlemapClass;
  private _id: string;
  private _overlay: Leaflet.ImageOverlay;
  private _border?: Leaflet.Rectangle;
  private _dragMarker?: Leaflet.Marker;
  private _url: string;
  private _movable: {
    type: MovableType;
    by: MovableByType;
  };
  private _scale: number;
  private _rotation: number;

  constructor(
    e: DragEvent,
    battlemap: BattlemapClass,
    backgroundImage: ImageInterface
  ) {
    super();

    this._battlemap = battlemap;

    const pos = battlemap.map.mouseEventToLatLng(e);
    const imageUrl = backgroundImage.url;
    const originalWidth = Number.parseFloat(
      backgroundImage.customMetadata.width
    );
    const originalHeight = Number.parseFloat(
      backgroundImage.customMetadata.height
    );
    const [width, height] = calculateImageSize(originalWidth, originalHeight);
    const bounds = calculateBoundsFromFree(pos, width, height);
    const imageOverlay = Leaflet.imageOverlay(imageUrl, bounds, {
      interactive: true,
    })
      .bringToFront()
      .addTo(battlemap.background.layer);

    // Set properties
    this._id = makeid(10);
    this._overlay = imageOverlay;
    this._url = imageUrl;
    this._movable = {
      type: "free",
      by: "admin",
    };
    this._scale = 1;
    this._rotation = 0;

    //TODO Change with permissions
    this.addImageOverlayMoveListener();
    this.addImageOverlayMouseOverListener();
    this.addImageOverlayMouseOutListener();
    this.addContextMenuListener();

    this._battlemap.background.assets.set(this._id, this);
  }

  destruct(): void {
    if (this._border)
      this._battlemap.background.borderLayer.removeLayer(this._border);

    this._battlemap.background.layer.removeLayer(this._overlay);
    this._battlemap.background.assets.delete(this._id);
  }

  resizeImage() {
    return null;
  }

  get battlemap(): BattlemapClass {
    return this._battlemap;
  }

  get id(): string {
    return this._id;
  }

  get overlay(): Leaflet.ImageOverlay {
    return this._overlay;
  }

  get border(): Leaflet.Rectangle | undefined {
    return this._border;
  }

  get dragMarker(): Leaflet.Marker | undefined {
    return this._dragMarker;
  }

  set dragMarker(marker: Leaflet.Marker | undefined) {
    this._dragMarker = marker;
  }

  get url(): string {
    return this._url;
  }

  get movable(): { type: MovableType; by: MovableByType } {
    return this._movable;
  }

  get scale(): number {
    return this._scale;
  }

  get rotation(): number {
    return this._rotation;
  }

  get selected(): Accessor<Map<string, InteractiveClass> | undefined> {
    return this._battlemap.background.selected;
  }
}
