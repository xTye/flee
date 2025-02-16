import Leaflet from "leaflet";
import { BattlemapClass } from "../BattlemapClass";
import { TokenInteractiveClass } from "../interactive/TokenInteractiveClass";

export class ConditionManagerClass {
  private _battlemap: BattlemapClass;
  private _token: TokenInteractiveClass;
  private _conditions: Map<ConditionType, ConditionInterface>;

  constructor(battlemap: BattlemapClass, token: TokenInteractiveClass) {
    this._battlemap = battlemap;
    this._token = token;
    this._conditions = new Map();
  }

  addCondition(type: ConditionType) {
    //! Fix this
    if (this._conditions.has(type)) return;
    const bounds = this._token.overlay.getBounds();

    const url = CONDITION_ICON_URL_IMAGES[type];

    const overlay = Leaflet.imageOverlay(url, bounds).bringToFront();

    const condition: ConditionInterface = {
      type: type,
      url: CONDITION_ICON_URL_IMAGES[type],
      overlay: overlay,
    };

    this._conditions.set(type, condition);

    this.manageTokenIcons();

    condition.overlay.addTo(this._battlemap.token.conditionsLayer);
  }

  manageTokenIcons() {
    const bounds = this._token.overlay.getBounds();

    const northEast = bounds.getNorthEast();
    const southWest = bounds.getNorthEast();

    let i = 0;

    for (const [key, condition] of this._conditions) {
      if (condition.type === "dead") {
        condition.overlay.setBounds(bounds);
        continue;
      }

      let iconBounds = Leaflet.latLngBounds(
        [
          southWest.lat - this._battlemap.grid.deltaLat / 4,
          southWest.lng -
            this._battlemap.grid.deltaLng / 4 -
            (i * this._battlemap.grid.deltaLng) / 4,
        ],
        [northEast.lat, northEast.lng - (i * this._battlemap.grid.deltaLng) / 4]
      );

      if (iconBounds.getWest() < bounds.getWest())
        iconBounds = Leaflet.latLngBounds([0, 0], [0, 0]);

      condition.overlay.setBounds(iconBounds);

      i++;
    }
  }

  removeCondition(type: ConditionType) {
    if (!this._conditions.has(type)) return;

    this._battlemap.token.conditionsLayer.removeLayer(
      this._conditions.get(type)?.overlay!
    );

    this._conditions.delete(type);

    this.manageTokenIcons();
  }

  removeAllConditions() {
    for (const [key, condition] of this._conditions) {
      this._battlemap.token.conditionsLayer.removeLayer(condition.overlay);
    }

    this._conditions.clear();
  }

  get conditions(): Map<ConditionType, ConditionInterface> {
    return this._conditions;
  }

  has(type: ConditionType): boolean {
    return this._conditions.has(type);
  }
}

export interface ConditionInterface {
  type: ConditionType;
  url: string;
  overlay: Leaflet.ImageOverlay;
}

export type ConditionType =
  | "dead"
  | "blinded"
  | "charmed"
  | "deafened"
  | "frightened"
  | "grappled"
  | "incapacitated"
  | "invisible"
  | "paralyzed"
  | "petrified"
  | "poisoned"
  | "prone"
  | "restrained"
  | "stunned"
  | "unconscious"
  | "exhaustion";

export const CONDITION_ICON_URL_IMAGES = {
  dead: "/battlemap-images/essentials/dead.png",
  blinded: "/battlemap-images/essentials/blinded.png",
  charmed: "/battlemap-images/essentials/charmed.png",
  deafened: "/battlemap-images/essentials/deafened.png",
  frightened: "/battlemap-images/essentials/frightened.png",
  grappled: "/battlemap-images/essentials/grappled.png",
  incapacitated: "/battlemap-images/essentials/incapacitated.png",
  invisible: "/battlemap-images/essentials/invisible.png",
  paralyzed: "/battlemap-images/essentials/paralyzed.png",
  petrified: "/battlemap-images/essentials/petrified.png",
  poisoned: "/battlemap-images/essentials/poisoned.png",
  prone: "/battlemap-images/essentials/prone.png",
  restrained: "/battlemap-images/essentials/restrained.png",
  stunned: "/battlemap-images/essentials/stunned.png",
  unconscious: "/battlemap-images/essentials/unconscious.png",
  exhaustion: "/battlemap-images/essentials/exhaustion.png",
};
