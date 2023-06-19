import Leaflet from "leaflet";
import { Accessor, Setter, createSignal } from "solid-js";
import { BattlemapClass } from "../BattlemapClass";
import { AssetClass } from "../movables/AssetClass";
import { ImageInterface } from "../../../types/ImageType";
import { calculateBackgroundImageBounds } from "../../../hooks/battlemap-utils/calculateUtil";

export class BackgroundLayerClass {
  private _battlemap: BattlemapClass;
  private _layer: Leaflet.LayerGroup;
  private _borderLayer: Leaflet.LayerGroup;
  private _image: Leaflet.ImageOverlay;
  private _url: string;
  private _selected: Accessor<Map<string, AssetClass> | undefined>;
  private _setSelected: Setter<Map<string, AssetClass> | undefined>;
  private _assets: Map<string, AssetClass>;

  constructor(battlemap: BattlemapClass) {
    const layer = Leaflet.layerGroup().addTo(battlemap.map);
    const borderLayer = Leaflet.layerGroup().addTo(battlemap.map);

    const url =
      "https://firebasestorage.googleapis.com/v0/b/flee-website.appspot.com/o/battlemap%2Fmaps%2Fgreen-forest-1?alt=media&token=ca9c2e6a-f050-4026-bb3e-1eb251de760b";

    const image = Leaflet.imageOverlay(url, battlemap.map.options.maxBounds!)
      .bringToFront()
      .addTo(layer);

    const [selected, setSelected] = createSignal<Map<string, AssetClass>>();

    this._layer = layer;
    this._borderLayer = borderLayer;
    this._image = image;
    this._url = url;
    this._selected = selected;
    this._setSelected = setSelected;
    this._assets = new Map();

    this._battlemap = battlemap;
  }

  changeBackground(backgroundImage: ImageInterface) {
    const { width, height } = backgroundImage.customMetadata;

    const widthNum = Number.parseFloat(width);
    const heightNum = Number.parseFloat(height);

    const { bounds } = calculateBackgroundImageBounds(widthNum, heightNum);

    this._url = backgroundImage.url;
    this._image.setUrl(backgroundImage.url);
    this._image.setBounds(bounds);
  }

  get layer(): Leaflet.LayerGroup {
    return this._layer;
  }

  get borderLayer(): Leaflet.LayerGroup {
    return this._borderLayer;
  }

  get image(): Leaflet.ImageOverlay {
    return this._image;
  }

  get url(): string {
    return this._url;
  }

  get selected(): Map<string, AssetClass> | undefined {
    return this._selected();
  }

  get setSelected(): Setter<Map<string, AssetClass> | undefined> {
    return this._setSelected;
  }

  get assets(): Map<string, AssetClass> {
    return this._assets;
  }
}
