import Leaflet from "leaflet";
import { BattlemapClass } from "../BattlemapClass";

export class FogLayerClass {
  private _battlemap: BattlemapClass;
  private _layer: Leaflet.LayerGroup;
  private _blob?: Blob;
  private _image?: Leaflet.ImageOverlay;

  constructor(battlemap: BattlemapClass) {
    const layer = Leaflet.layerGroup().addTo(battlemap.map);

    this._layer = layer;
    this._battlemap = battlemap;
  }

  toggle(on: boolean) {
    if (on && this._battlemap.map.hasLayer(this._layer)) return;

    if (on) this._layer.addTo(this._battlemap.map);
    else this._layer.removeFrom(this._battlemap.map);
  }

  get layer(): Leaflet.LayerGroup {
    return this._layer;
  }

  get blob(): Blob | undefined {
    return this._blob;
  }

  get image(): Leaflet.ImageOverlay | undefined {
    return this._image;
  }

  set layer(layer: Leaflet.LayerGroup) {
    this._layer = layer;
  }

  set blob(blob: Blob | undefined) {
    this._blob = blob;
  }

  set image(image: Leaflet.ImageOverlay | undefined) {
    this._image = image;
  }
}
