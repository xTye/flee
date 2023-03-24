import Konva from "konva";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import { Vector2d } from "konva/lib/types";
import { KonvaInterface } from "../types/KonvaType";
import { calculateContainerPointsFromMap } from "./battlemap-utils/calculateUtil";
import { BattlemapInterface } from "../types/BattlemapType";
import { useAddFog } from "./BattlemapHooks";

export const useKonvaStage = (
  div: HTMLDivElement,
  konva: KonvaInterface,
  battlemap: BattlemapInterface
) => {
  konva.stage = new Konva.Stage({
    container: div,
    width: window.innerWidth,
    height: window.innerHeight - navbarHeight.height,
  });

  //@ts-ignore
  konva.lasso = {};
  //@ts-ignore
  konva.fog = {};

  konva.lasso.layer = new Konva.Layer();
  konva.fog.layer = new Konva.Layer();
  konva.stage.add(konva.lasso.layer);
  konva.stage.add(konva.fog.layer);

  konva.fog.image = new Konva.Image({
    image: new Image(),
  });
  konva.fog.layer.add(konva.fog.image);

  konva.lasso.line = new Konva.Line({
    lineJoin: "round",
    tension: 0.5,
    closed: true,
    fill: "blue",
    opacity: 0.5,
  });
  konva.lasso.layer.add(konva.lasso.line);

  let isPaint = false;
  let points: any[] = [];

  konva.stage.on("mousedown touchstart", (e) => {
    isPaint = true;
    konva.lasso.line.opacity(0.5);
    if (konva.lasso.e.shiftKey) {
      konva.lasso.line.fill("red");
    } else {
      konva.lasso.line.fill("blue");
    }
  });

  konva.stage.on("mousemove touchmove", (e) => {
    if (!isPaint) return;

    const pos = konva.stage.getPointerPosition() as Vector2d;
    points = points.concat([pos.x, pos.y]);

    konva.lasso.line.points(points);
  });

  konva.stage.on("mouseup touchend", async (e) => {
    if (!isPaint) return;

    isPaint = false;

    if (konva.lasso.e.shiftKey) {
      konva.lasso.line.opacity(1);
    } else {
      konva.lasso.line.opacity(1);
      konva.lasso.line.fill("black");
    }

    konva.fog.canvas = konva.lasso.line.toCanvas({
      width: konva.stage.width(),
      height: konva.stage.height(),
      x: 0,
      y: 0,
    });

    useAddFog(battlemap, konva);

    points = [];
    konva.lasso.line.points(points);
  });
};
