import Konva from "konva";

export type KonvaToolType = "line" | "rect" | "circle";

export interface KonvaInterface {
  stage: Konva.Stage;
  tool: KonvaToolType;
  dragged: boolean;
  start: Konva.Vector2d;
  e: MouseEvent;
  shape: Konva.Shape;
  line: Konva.Line;
  rect: Konva.Rect;
  circle: Konva.Circle;
  layer: Konva.Layer;
  canvas: HTMLCanvasElement;
}
