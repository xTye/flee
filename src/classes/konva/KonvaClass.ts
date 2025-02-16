import Leaflet from "leaflet";
import Konva from "konva";
import { navbarHeight } from "@/components/navbar/NavbarComponent";
import { calculateContainerPointsFromMap } from "@/hooks/battlemap-utils/calculateUtil";
import { BattlemapClass } from "../battlemap/BattlemapClass";
import { Setter, onCleanup } from "solid-js";
import { InteractiveClass } from "../battlemap/interactive/InteractiveClass";
import { BackgroundLayerClass } from "../battlemap/layers/BackgroundLayerClass";
import { TokenLayerClass } from "../battlemap/layers/TokenLayerClass";

export class KonvaClass {
  private _battlemap: BattlemapClass;
  private _stage: Konva.Stage;
  private _tool: KonvaToolType;
  private _dragged: boolean;
  private _start: Konva.Vector2d;
  private _e: MouseEvent;
  private _shape: Konva.Shape;
  private _line: Konva.Line;
  private _rect: Konva.Rect;
  private _circle: Konva.Circle;
  private _layer: Konva.Layer;
  private _canvas: HTMLCanvasElement;

  constructor(div: HTMLDivElement, battlemap: BattlemapClass) {
    this._battlemap = battlemap;
    this._dragged = false;
    this._start = { x: 0, y: 0 };
    this._e = {} as MouseEvent;
    this._shape = {} as Konva.Shape;
    this._canvas = {} as HTMLCanvasElement;

    this._stage = new Konva.Stage({
      container: div,
      width: window.innerWidth,
      height: window.innerHeight - navbarHeight.height,
    });

    this._tool = "line";

    this._layer = new Konva.Layer();
    this._stage.add(this._layer);
    this._stage.add(this._layer);

    this._line = new Konva.Line({
      lineJoin: "round",
      tension: 0.5,
      closed: true,
      fill: "blue",
      opacity: 0.5,
    });

    this._rect = new Konva.Rect({
      lineJoin: "round",
      tension: 0.5,
      closed: true,
      fill: "blue",
      opacity: 0.5,
    });

    this._circle = new Konva.Circle({
      lineJoin: "round",
      tension: 0.5,
      closed: true,
      fill: "blue",
      opacity: 0.5,
    });

    let isPaint = false;
    let points: any[] = [];

    this._stage.on("mousedown touchstart", (e) => {
      isPaint = true;
      this._dragged = false;

      //@ts-ignore
      const pos = { x: this._e.layerX, y: this._e.layerY } as Vector2d;
      this._start = pos;

      if (this._tool === "line") {
        this._shape = this._line;
        points = points.concat([pos.x, pos.y]);
        this._line.points(points);
      } else if (this._tool === "rect") {
        this._shape = this._rect;
        this._rect.x(pos.x);
        this._rect.y(pos.y);
      } else {
        this._shape = this._circle;
        this._circle.x(pos.x);
        this._circle.y(pos.y);
      }

      this._shape.opacity(0.5);
      if (this._e.shiftKey) {
        this._shape.fill("red");
      } else {
        this._shape.fill("blue");
      }

      this._layer.add(this._shape);
    });

    this._stage.on("mousemove touchmove", (e) => {
      if (!isPaint) return;
      this._dragged = true;

      const pos = this._stage.getPointerPosition() as Konva.Vector2d;

      if (this._tool === "line") {
        points = points.concat([pos.x, pos.y]);
        this._line.points(points);
      } else if (this._tool === "rect") {
        this._rect.width(pos.x - this._rect.x());
        this._rect.height(pos.y - this._rect.y());
      } else {
        this._circle.radius(
          Math.sqrt(
            Math.pow(pos.x - this._circle.x(), 2) +
              Math.pow(pos.y - this._circle.y(), 2)
          )
        );
      }
    });

    this._stage.on("mouseup touchend", async (e) => {
      if (!isPaint) return;
      isPaint = false;

      if (this._e.shiftKey) {
        this._shape.opacity(1);
      } else {
        this._shape.opacity(1);
        this._shape.fill("black");
      }

      this._canvas = this._shape.toCanvas({
        width: this._stage.width(),
        height: this._stage.height(),
        x: 0,
        y: 0,
      });

      // TODO: Add other hooks here | Depending on tab selected
      const tab = this._battlemap.events.tab();
      switch (tab) {
        case "background":
          this.select();
          break;
        case "token":
          this.select();
          break;
        case "fog":
          this.changeFog();
          break;
      }

      //! This could be a problem because of the callbacks in the hooks
      this._shape.remove();

      if (this._tool === "line") {
        points = [];
        this._line.points(points);
      } else if (this._tool === "rect") {
        this._rect.width(0);
        this._rect.height(0);
      } else {
        this._circle.radius(0);
      }
    });
  }

  toggle(setShow: Setter<boolean>) {
    const onDrag = (e: MouseEvent) => {
      if (
        this._battlemap.events.tab() !== "fog" &&
        this._battlemap.events.tab() !== "background" &&
        this._battlemap.events.tab() !== "token"
      )
        return;
      if (
        e.button !== 2 ||
        this._battlemap.events.dragging ||
        !this._battlemap.fog.isActive()
      )
        return;
      this._e = e;
      setShow(true);
      this._stage.fire("mousedown");
    };

    const onDragEnd = (e: any) => {
      setShow(false);
    };

    document.body.addEventListener("mousedown", onDrag);
    document.body.addEventListener("mouseup", onDragEnd);

    onCleanup(() => {
      document.body.removeEventListener("mousedown", onDrag);
      document.body.removeEventListener("mouseup", onDragEnd);
    });
  }

  select() {
    if (this._e.shiftKey && this._e.ctrlKey) return;

    let prevInteractives: Map<string, InteractiveClass> | undefined;
    let interactiveLayer: BackgroundLayerClass | TokenLayerClass | undefined;

    switch (this._battlemap.events.tab()) {
      case "background":
        interactiveLayer = this._battlemap.background;
        break;
      case "token":
        interactiveLayer = this._battlemap.token;
        break;
    }

    prevInteractives = interactiveLayer?.selected();

    const interactives: Map<string, InteractiveClass> = new Map<
      string,
      InteractiveClass
    >();
    let latlng: Leaflet.LatLngExpression | undefined;
    let singleInteractive: InteractiveClass | undefined;

    // If the user is not dragging, then we need to check if the user is clicking
    if (!this._dragged) {
      latlng = this._battlemap.map.containerPointToLatLng([
        this._start.x,
        this._start.y,
      ]);
    }

    // Iterate through the assets
    for (const [key, asset] of this._battlemap.background.assets) {
      // If the ctrl key is pressed, then we need to add the previous tokens to the selection
      if (this._e.ctrlKey && prevInteractives) {
        if (prevInteractives.has(asset.id)) {
          interactives.set(asset.id, asset);
          continue;
        }
      }

      if (this._e.shiftKey && prevInteractives) {
        if (prevInteractives.has(asset.id)) {
          interactives.set(asset.id, asset);
        }
      }

      const bounds = asset.overlay.getBounds();

      if (this._dragged) {
        const northEast = this._battlemap.map.latLngToContainerPoint(
          bounds.getNorthEast()
        );
        const northWest = this._battlemap.map.latLngToContainerPoint(
          bounds.getNorthWest()
        );
        const southEast = this._battlemap.map.latLngToContainerPoint(
          bounds.getSouthEast()
        );
        const southWest = this._battlemap.map.latLngToContainerPoint(
          bounds.getSouthWest()
        );

        // If this gets bad, use stage.getInstersection()
        if (
          this._shape.intersects(northEast) ||
          this._shape.intersects(northWest) ||
          this._shape.intersects(southEast) ||
          this._shape.intersects(southWest)
        )
          if (this._e.shiftKey) interactives.delete(asset.id);
          else interactives.set(asset.id, asset);
      } else if (latlng) {
        // If we didn't drag, then we need to check if the user clicked on a asset
        if (bounds.contains(latlng)) singleInteractive = asset;
      }
    }

    if (singleInteractive) {
      if (this._e.shiftKey) interactives.delete(singleInteractive.id);
      else interactives.set(singleInteractive.id, singleInteractive);
    }

    if (interactives.size === 0 || !interactives)
      interactiveLayer?.setSelected();
    //@ts-ignore
    else interactiveLayer?.setSelected(interactives);
  }

  changeFog() {
    if (!this._battlemap.fog.isActive()) return;
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (this._battlemap.fog.blob) {
      const image = new Image();
      image.src = URL.createObjectURL(this._battlemap.fog.blob);
      image.onload = () => {
        ctx.drawImage(image, 0, 0);

        this.addFogCallback(canvas, ctx);
      };

      return;
    }

    this.addFogCallback(canvas, ctx);
  }

  addFogCallback(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const { topLeft, bottomRight } = calculateContainerPointsFromMap(
      this._battlemap
    );
    const width = bottomRight.x - topLeft.x;
    const scale = canvas.width / width;

    if (this._e.shiftKey) ctx.globalCompositeOperation = "destination-out";
    else ctx.globalCompositeOperation = "source-over";

    ctx.scale(scale, scale);
    ctx.drawImage(this._canvas, -topLeft.x, -topLeft.y);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const imageUrl = URL.createObjectURL(blob);
      this._battlemap.fog.blob = blob;

      const prev = this._battlemap.fog.image;

      this._battlemap.fog.image = Leaflet.imageOverlay(
        imageUrl,
        this._battlemap.map.options.maxBounds!,
        {
          opacity: 0.5,
        }
      )
        .bringToFront()
        .addTo(this._battlemap.fog.layer);

      if (prev) this._battlemap.fog.layer.removeLayer(prev);
    });
  }

  get stage(): Konva.Stage {
    return this._stage;
  }

  get tool(): KonvaToolType {
    return this._tool;
  }

  set tool(tool: KonvaToolType) {
    this._tool = tool;
  }

  get dragged(): boolean {
    return this._dragged;
  }

  get start(): Konva.Vector2d {
    return this._start;
  }
}

export type KonvaToolType = "line" | "rect" | "circle";
