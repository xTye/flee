import Konva from "konva";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import { Vector2d } from "konva/lib/types";
import { KonvaInterface } from "../types/KonvaType";
import { calculateContainerPointsFromMap } from "./battlemap-utils/calculateUtil";
import { BattlemapInterface } from "../types/BattlemapType";
import { useAddFog } from "./BattlemapHooks";

/**
 *
 * @param div Div element to attach Konva stage to
 * @param konva Konva interface
 * @param battlemap Battlemap interface
 */
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

  konva.tool = "line";

  konva.layer = new Konva.Layer();
  konva.stage.add(konva.layer);
  konva.stage.add(konva.layer);

  konva.line = new Konva.Line({
    lineJoin: "round",
    tension: 0.5,
    closed: true,
    fill: "blue",
    opacity: 0.5,
  });

  konva.rect = new Konva.Rect({
    lineJoin: "round",
    tension: 0.5,
    closed: true,
    fill: "blue",
    opacity: 0.5,
  });

  konva.circle = new Konva.Circle({
    lineJoin: "round",
    tension: 0.5,
    closed: true,
    fill: "blue",
    opacity: 0.5,
  });

  let isPaint = false;
  let points: any[] = [];

  konva.stage.on("mousedown touchstart", (e) => {
    isPaint = true;

    if (konva.tool === "line") {
      konva.shape = konva.line;
    } else if (konva.tool === "rect") {
      konva.shape = konva.rect;
      konva.rect.x(konva.e.offsetX);
      konva.rect.y(konva.e.offsetY);
    } else {
      konva.shape = konva.circle;
      konva.circle.x(konva.e.offsetX);
      konva.circle.y(konva.e.offsetY);
    }

    konva.shape.opacity(0.5);
    if (konva.e.shiftKey) {
      konva.shape.fill("red");
    } else {
      konva.shape.fill("blue");
    }

    konva.layer.add(konva.shape);
  });

  konva.stage.on("mousemove touchmove", (e) => {
    if (!isPaint) return;

    const pos = konva.stage.getPointerPosition() as Vector2d;

    if (konva.tool === "line") {
      points = points.concat([pos.x, pos.y]);
      konva.line.points(points);
    } else if (konva.tool === "rect") {
      konva.rect.width(pos.x - konva.rect.x());
      konva.rect.height(pos.y - konva.rect.y());
    } else {
      konva.circle.radius(
        Math.sqrt(
          Math.pow(pos.x - konva.circle.x(), 2) +
            Math.pow(pos.y - konva.circle.y(), 2)
        )
      );
    }
  });

  konva.stage.on("mouseup touchend", async (e) => {
    if (!isPaint) return;
    isPaint = false;

    if (konva.e.shiftKey) {
      konva.shape.opacity(1);
    } else {
      konva.shape.opacity(1);
      konva.shape.fill("black");
    }

    konva.canvas = konva.shape.toCanvas({
      width: konva.stage.width(),
      height: konva.stage.height(),
      x: 0,
      y: 0,
    });

    useAddFog(battlemap, konva);

    konva.shape.remove();

    if (konva.tool === "line") {
      points = [];
      konva.line.points(points);
    } else if (konva.tool === "rect") {
      konva.rect.width(0);
      konva.rect.height(0);
    } else {
      konva.circle.radius(0);
    }
  });
};
