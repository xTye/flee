import Leaflet from "leaflet";

import { makeid } from "../../../hooks/BattlemapHooks";
import { BattlemapClass } from "../BattlemapClass";
import { CharacterInterface } from "../../../types/CharacterType";

export class AssetClass {
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
    character: CharacterInterface,
    battlemap: BattlemapClass
  ) {
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
      .addTo(this.battlemap.background.layer);

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
    addImageOverlayMoveListener(battlemap, asset);
    addImageOverlayMouseOverListener(battlemap, asset);
    addImageOverlayMouseOutListener(battlemap, asset);
    addAssetContextMenuListener(battlemap, asset);

    battlemap.background.assets.set(asset.id, asset);

    this._battlemap = battlemap;
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

  get url(): string {
    return this._url;
  }

  get movable(): {
    type: MovableType;
    by: MovableByType;
  } {
    return this._movable;
  }

  get scale(): number {
    return this._scale;
  }

  get rotation(): number {
    return this._rotation;
  }

  set dragMarker(marker: Leaflet.Marker | undefined) {
    this._dragMarker = marker;
  }
}
