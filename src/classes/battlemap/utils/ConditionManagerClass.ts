import Leaflet from "leaflet";
import { TokenClass } from "../movables/TokenClass";
import { BattlemapClass } from "../BattlemapClass";

export class ConditionManagerClass {
  private battlemap: BattlemapClass;
  private token: TokenClass;
  private conditions: Map<ConditionType, ConditionInterface>;

  constructor(battlemap: BattlemapClass, token: TokenClass) {
    this.battlemap = battlemap;
    this.token = token;
    this.conditions = new Map();
  }

  addCondition(type: ConditionType) {
    //! Fix this
    if (this.conditions.has(type)) return;
    const bounds = this.token.overlay.getBounds();

    const url = CONDITION_ICON_URL_IMAGES[type];

    const overlay = Leaflet.imageOverlay(url, bounds).bringToFront();

    const condition: ConditionInterface = {
      type: type,
      url: CONDITION_ICON_URL_IMAGES[type],
      overlay: overlay,
    };

    this.conditions.set(type, condition);

    this.manageTokenIcons();

    condition.overlay.addTo(this.battlemap.token.conditionsLayer);
  }

  manageTokenIcons() {
    const bounds = this.token.overlay.getBounds();

    const northEast = bounds.getNorthEast();
    const southWest = bounds.getNorthEast();

    let i = 0;

    for (const [key, condition] of this.token.conditions) {
      if (condition.type === "dead") {
        condition.overlay.setBounds(bounds);
        continue;
      }

      let iconBounds = Leaflet.latLngBounds(
        [
          southWest.lat - this.battlemap.grid.deltaLat / 4,
          southWest.lng -
            this.battlemap.grid.deltaLng / 4 -
            (i * this.battlemap.grid.deltaLng) / 4,
        ],
        [northEast.lat, northEast.lng - (i * this.battlemap.grid.deltaLng) / 4]
      );

      if (iconBounds.getWest() < bounds.getWest())
        iconBounds = Leaflet.latLngBounds([0, 0], [0, 0]);

      condition.overlay.setBounds(iconBounds);

      i++;
    }
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
