import Leaflet from "leaflet";
import { BackgroundLayerClass } from "./layers/BackgroundLayerClass";
import { GridLayerClass } from "./layers/GridLayerClass";
import { TokenLayerClass } from "./layers/TokenLayerClass";
import { FogLayerClass } from "./layers/FogLayerClass";
import { EventDataClass } from "./EventDataClass";

const maxBounds = [
  [-1, -1],
  [1, 1],
];

export class BattlemapClass {
  private _map: Leaflet.Map;
  private _background: BackgroundLayerClass;
  private _grid: GridLayerClass;
  private _token: TokenLayerClass;
  private _fog: FogLayerClass;
  private _events: EventDataClass;

  constructor(div: HTMLDivElement) {
    const map = Leaflet.map(div, {
      center: [0, 0],
      // @ts-ignore
      maxBounds,
      zoom: 10,
      minZoom: 8,
      maxZoom: 12,
      zoomAnimation: false,
    });

    map.zoomControl.setPosition("bottomright");

    map.on("zoomstart", (e) => {
      if (this._events.dragging) {
        for (const [key, value] of this._events.dragging) {
          value.overlay.setOpacity(1);

          value.dragMarker?.remove();
          value.dragMarker = undefined;
          this._events.dragging = undefined;
        }
      }
    });

    map.on("mousedown", (e) => {
      if (e.originalEvent && e.originalEvent.button === 2) return;
    });

    map.on("mouseup", (e) => {});

    this._map = map;
    this._background = new BackgroundLayerClass(this);
    this._grid = new GridLayerClass(this);
    this._token = new TokenLayerClass(this);
    this._fog = new FogLayerClass(this);
    this._events = new EventDataClass(this);
  }

  get background(): BackgroundLayerClass {
    return this._background;
  }

  get grid(): GridLayerClass {
    return this._grid;
  }

  get token(): TokenLayerClass {
    return this._token;
  }

  get fog(): FogLayerClass {
    return this._fog;
  }

  get events(): EventDataClass {
    return this._events;
  }

  get map(): Leaflet.Map {
    return this.map;
  }
}
