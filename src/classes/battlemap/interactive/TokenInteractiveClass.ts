import Leaflet from "leaflet";

import { BattlemapClass } from "../BattlemapClass";
import { CharacterInterface } from "../../../types/CharacterType";
import { ConditionManagerClass } from "../utils/ConditionManagerClass";
import {
  calculateBoundsFromFree,
  calculateBoundsFromGrid,
} from "../../../hooks/battlemap-utils/calculateUtil";
import {
  InteractiveClass,
  MovableByType,
  MovableType,
} from "./InteractiveClass";
import { makeid } from "../../../utils/makeid";
import { Accessor } from "solid-js";

export class TokenInteractiveClass extends InteractiveClass {
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

  private _characterId: string;
  private _conditions: ConditionManagerClass;

  constructor(
    e: DragEvent,
    battlemap: BattlemapClass,
    character: CharacterInterface
  ) {
    super();

    this._battlemap = battlemap;

    const pos = battlemap.map.mouseEventToLatLng(e);
    const bounds = calculateBoundsFromGrid(pos, battlemap, { mousePos: true });
    const imageOverlay = Leaflet.imageOverlay(character.image, bounds, {
      interactive: true,
    })
      .bringToFront()
      .addTo(battlemap.token.layer);

    // Set properties
    this._id = makeid(10);
    this._characterId = character.id;
    this._overlay = imageOverlay;
    this._url = character.image;
    this._conditions = new ConditionManagerClass(battlemap, this);
    this._movable = {
      type: "grid",
      by: "all",
    };
    this._scale = 1;
    this._rotation = 0;

    //TODO Change with permissions
    this.addImageOverlayMoveListener();
    this.addImageOverlayMouseOverListener();
    this.addImageOverlayMouseOutListener();
    this.addContextMenuListener();

    this._battlemap.token.tokens.set(this._id, this);
  }

  destruct(): void {
    if (this._border)
      this._battlemap.token.borderLayer.removeLayer(this._border);

    this._conditions.removeAllConditions();

    this._battlemap.token.layer.removeLayer(this._overlay);
    this._battlemap.token.tokens.delete(this.id);
  }

  resizeImage(): void {
    const bounds = this._overlay.getBounds();
    const pos = bounds.getSouthWest();

    let newBounds: Leaflet.LatLngBounds;

    if (this._movable.type === "grid") {
      newBounds = calculateBoundsFromGrid(pos, this._battlemap, {
        scale: this._scale,
      });
    } else {
      const [width, height] = [
        Math.abs(bounds.getEast() - bounds.getWest()),
        Math.abs(bounds.getNorth() - bounds.getSouth()),
      ];
      newBounds = calculateBoundsFromFree(
        bounds.getSouthWest(),
        width,
        height,
        this._scale
      );
    }

    this._overlay.setBounds(newBounds);
    this._border?.setBounds(newBounds);

    this._conditions.manageTokenIcons();
  }

  rotateImage(): void {}

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

  set dragMarker(value: Leaflet.Marker | undefined) {
    this._dragMarker = value;
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

  set scale(value: number) {
    this._scale = value;
  }

  get rotation(): number {
    return this._rotation;
  }

  set rotation(value: number) {
    this._rotation = value;
  }

  get characterId(): string {
    return this._characterId;
  }

  get conditions(): ConditionManagerClass {
    return this._conditions;
  }

  get selected(): Accessor<Map<string, InteractiveClass> | undefined> {
    return this._battlemap.background.selected;
  }
}
