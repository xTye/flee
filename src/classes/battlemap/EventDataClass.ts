import { BattlemapClass } from "./BattlemapClass";
import { AssetClass } from "./movables/AssetClass";
import { TokenClass } from "./movables/TokenClass";

export class EventDataClass {
  private _battlemap: BattlemapClass;
  private _tab: TabType;
  private _dragging?: Map<string, TokenClass | AssetClass>;

  constructor(battlemap: BattlemapClass) {
    this._tab = "pages";
    this._battlemap = battlemap;
  }

  get tab(): TabType {
    return this._tab;
  }

  set tab(tab: TabType) {
    this._tab = tab;
  }

  get dragging(): Map<string, TokenClass | AssetClass> | undefined {
    return this._dragging;
  }

  set dragging(dragging: Map<string, TokenClass | AssetClass> | undefined) {
    this._dragging = dragging;
  }
}

export type TabType = "pages" | "background" | "grid" | "token" | "fog";
