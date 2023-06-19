import Leaflet from "leaflet";

import { BattlemapClass } from "../BattlemapClass";
import { Accessor, Setter, createSignal } from "solid-js";
import { TokenClass } from "../movables/TokenClass";

export class TokenLayerClass {
  private _battlemap: BattlemapClass;
  private _layer: Leaflet.LayerGroup;
  private _conditionsLayer: Leaflet.LayerGroup;
  private _borderLayer: Leaflet.LayerGroup;
  private _selected: Accessor<Map<string, TokenClass> | undefined>;
  private _setSelected: Setter<Map<string, TokenClass> | undefined>;
  private _tokens: Map<string, TokenClass>;

  constructor(battlemap: BattlemapClass) {
    const layer = Leaflet.layerGroup().addTo(battlemap.map);
    const conditionsLayer = Leaflet.layerGroup().addTo(battlemap.map);
    const borderLayer = Leaflet.layerGroup().addTo(battlemap.map);

    const [selected, setSelected] = createSignal<Map<string, TokenClass>>();

    this._layer = layer;
    this._conditionsLayer = conditionsLayer;
    this._borderLayer = borderLayer;
    this._selected = selected;
    this._setSelected = setSelected;
    this._tokens = new Map();
    this._battlemap = battlemap;
  }

  get layer(): Leaflet.LayerGroup {
    return this._layer;
  }

  get conditionsLayer(): Leaflet.LayerGroup {
    return this._conditionsLayer;
  }

  get borderLayer(): Leaflet.LayerGroup {
    return this._borderLayer;
  }

  get selected(): Accessor<Map<string, TokenClass> | undefined> {
    return this._selected;
  }

  get setSelected(): Setter<Map<string, TokenClass> | undefined> {
    return this._setSelected;
  }

  get tokens(): Map<string, TokenClass> {
    return this._tokens;
  }

  get battlemap(): BattlemapClass {
    return this._battlemap;
  }
}
