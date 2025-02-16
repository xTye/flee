import { Accessor, Setter, createSignal } from "solid-js";
import { BattlemapClass } from "../BattlemapClass";
import { InteractiveClass } from "./InteractiveClass";

export class EventDataClass {
  private _battlemap: BattlemapClass;
  private _tab: Accessor<TabType>;
  private _setTab: Setter<TabType>;
  private _dragging?: Map<string, InteractiveClass>;

  constructor(battlemap: BattlemapClass) {
    const [tab, setTab] = createSignal<TabType>("pages");
    this._tab = tab;
    this._setTab = setTab;
    this._battlemap = battlemap;
  }

  get tab(): Accessor<TabType> {
    return this._tab;
  }

  set tab(tab: TabType) {
    this._setTab(tab);
  }

  get dragging(): Map<string, InteractiveClass> | undefined {
    return this._dragging;
  }

  set dragging(dragging: Map<string, InteractiveClass> | undefined) {
    this._dragging = dragging;
  }
}

export type TabType = "pages" | "background" | "grid" | "token" | "fog";
