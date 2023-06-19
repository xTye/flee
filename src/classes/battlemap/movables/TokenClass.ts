import Leaflet from "leaflet";
import { makeid } from "../../../hooks/BattlemapHooks";
import { BattlemapClass } from "../BattlemapClass";
import { CharacterInterface } from "../../../types/CharacterType";
import { ConditionManagerClass } from "../utils/ConditionManagerClass";

export class TokenClass {
  private _battlemap: BattlemapClass;
  private _id: string;
  private _characterId: string;
  private _overlay: Leaflet.ImageOverlay;
  private _border?: Leaflet.Rectangle;
  private _dragMarker?: Leaflet.Marker;
  private _conditions: ConditionManagerClass;
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
    const bounds = calculateBoundsFromGrid(pos, battlemap, { mousePos: true });

    const imageOverlay = Leaflet.imageOverlay(character.image, bounds, {
      interactive: true,
    })
      .bringToFront()
      .addTo(battlemap.token.layer);

    this._id = makeid(10);
    this._characterId = character.id;
    this._overlay = imageOverlay;
    this._url = character.image;
    this._conditions = new Map();
    this._movable = {
      type: "grid",
      by: "all",
    };
    this._scale = 1;
    this._rotation = 0;

    //TODO Change with permissions
    addImageOverlayMoveListener(battlemap, token);
    addImageOverlayMouseOverListener(battlemap, token);
    addImageOverlayMouseOutListener(battlemap, token);
    addTokenContextMenuListener(battlemap, token);

    battlemap.token.tokens.set(token.id, token);

    this._battlemap = battlemap;
  }

  get id(): string {
    return this._id;
  }

  get characterId(): string {
    return this._characterId;
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

  get conditions(): ConditionManagerClass {
    return this._conditions;
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

  set dragMarker(dragMarker: Leaflet.Marker | undefined) {
    this._dragMarker = dragMarker;
  }
}
