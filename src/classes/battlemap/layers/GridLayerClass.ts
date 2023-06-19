import Leaflet from "leaflet";
import * as Turf from "@turf/turf";

import { BattlemapClass } from "../BattlemapClass";

export class GridLayerClass {
  private _battlemap: BattlemapClass;
  private _layer: Leaflet.GeoJSON;
  private _show: boolean;
  private _cellSize: number;
  private _deltaX: number;
  private _deltaY: number;
  private _deltaLat: number;
  private _deltaLng: number;
  private _maxI: number;
  private _maxJ: number;
  private _tiles: {
    i: number;
    j: number;
    x: number;
    y: number;
    lat: number;
    lng: number;
    layer: Leaflet.Layer;
  }[][];

  constructor(battlemap: BattlemapClass, cellSize = 10) {
    // @ts-ignore
    const bounds = Leaflet.latLngBounds(battlemap.map.options.maxBounds!);
    const gridTurf = Turf.squareGrid(
      [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ],
      cellSize,
      {
        units: "kilometers",
      }
    );

    this._show = true;
    this._cellSize = cellSize;
    this._tiles = [[]];

    let minX = Number.NEGATIVE_INFINITY;
    let i = -1;
    let j = -1;

    this._layer = Leaflet.geoJSON(gridTurf, {
      interactive: false,
      style: {
        color: "#000",
        weight: 1,
        opacity: 0.2,
        fillOpacity: 0,
      },
      onEachFeature: (feature, layer) => {
        // @ts-ignore
        const cords: any = feature.geometry.coordinates[0];
        const x = cords[0][0];
        const y = cords[0][1];
        if (minX < x) {
          if (i !== -1) this.tiles.push([]);
          minX = x;
          i++;
          j = -1;
        }
        j++;

        this.tiles[i].push({ i, j, x, y, lat: y, lng: x, layer });
      },
    });

    this._deltaX = Math.abs(this.tiles[1][0].x - this.tiles[0][0].x);
    this._deltaY = Math.abs(this.tiles[0][1].y - this.tiles[0][0].y);
    this._deltaLat = this.deltaY;
    this._deltaLng = this.deltaX;
    this._maxI = this.tiles.length - 1;
    this._maxJ = this.tiles[0].length - 1;

    this._layer.addTo(battlemap.map);
    this._battlemap = battlemap;
  }

  toggle(on: boolean) {
    if (on && this._battlemap.map.hasLayer(this._layer)) return;

    if (on) this._layer.addTo(this._battlemap.map);
    else this._layer.removeFrom(this._battlemap.map);
  }

  get battlemap(): BattlemapClass {
    return this._battlemap;
  }

  get layer(): Leaflet.GeoJSON {
    return this._layer;
  }

  get show(): boolean {
    return this._show;
  }

  get cellSize(): number {
    return this._cellSize;
  }

  get deltaX(): number {
    return this._deltaX;
  }

  get deltaY(): number {
    return this._deltaY;
  }

  get deltaLat(): number {
    return this._deltaLat;
  }

  get deltaLng(): number {
    return this._deltaLng;
  }

  get maxI(): number {
    return this._maxI;
  }

  get maxJ(): number {
    return this._maxJ;
  }

  get tiles(): {
    i: number;
    j: number;
    x: number;
    y: number;
    lat: number;
    lng: number;
    layer: Leaflet.Layer;
  }[][] {
    return this._tiles;
  }
}
