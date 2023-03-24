import Konva from "konva";

export interface KonvaInterface {
  stage: Konva.Stage;
  lasso: {
    e: MouseEvent;
    line: Konva.Line;
    layer: Konva.Layer;
  };
  fog: {
    image: Konva.Image;
    canvas: HTMLCanvasElement;
    layer: Konva.Layer;
  };
}
