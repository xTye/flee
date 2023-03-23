import { Component, onMount } from "solid-js";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { navbarHeight } from "../navbar/NavbarComponent";
import { Stage } from "konva/lib/Stage";
import { removeContextMenu } from "../../utils/removeContextMenu";

const test1 = (stage: Stage) => {
  const layer = new Konva.Layer();
  stage.add(layer);

  const lasso = new Konva.Line({
    stroke: "red",
    strokeWidth: 2,
    lineJoin: "round",
    tension: 0.5,
    closed: true,
    fill: "blue",
    opacity: 0.5,
  });
  layer.add(lasso);

  let isPaint = false;
  let points: any[] = [];

  stage.on("mousedown touchstart", (e) => {
    isPaint = true;
    const pos = stage.getPointerPosition() as Vector2d;
    points = [pos.x, pos.y];
    lasso.points(points);
    layer.batchDraw();
  });

  stage.on("mousemove touchmove", (e) => {
    if (!isPaint) {
      return;
    }
    const pos = stage.getPointerPosition() as Vector2d;
    points = points.concat([pos.x, pos.y]);
    lasso.points(points);
    layer.batchDraw();
  });

  stage.on("mouseup touchend", (e) => {
    if (!isPaint) {
      return;
    }
    isPaint = false;
    const pos = stage.getPointerPosition() as Vector2d;
    points = points.concat([pos.x, pos.y]);
    lasso.fill("rgba(255, 0, 0, 0.5)");
    lasso.points(points);
    layer.batchDraw();

    //const dataUrl = stage.toDataURL();
    //console.log(dataUrl); // export the canvas as an image
  });
};

const test2 = (stage: Stage) => {
  const layer = new Konva.Layer();
  stage.add(layer);

  let lassoPoints: any[] = [];

  const lasso = new Konva.Shape({
    stroke: "red",
    strokeWidth: 2,
    dash: [4, 4],
    lineJoin: "round",
    tension: 0.5,
    sceneFunc: (context, shape) => {
      // Draw the shape
      context.beginPath();
      context.moveTo(lassoPoints[0], lassoPoints[1]);
      for (let i = 2; i < lassoPoints.length; i += 2) {
        context.lineTo(lassoPoints[i], lassoPoints[i + 1]);
      }
      context.closePath();

      // Fill the enclosed area with a solid color
      context.fillStyle = "blue";
      context.fillStrokeShape(shape);
    },
  });
  layer.add(lasso);

  let isPaint = false;

  stage.on("mousedown touchstart", (e) => {
    isPaint = true;
    const pos = stage.getPointerPosition() as Vector2d;
    lassoPoints = [pos.x, pos.y];
    layer.batchDraw();
  });

  stage.on("mousemove touchmove", (e) => {
    if (!isPaint) {
      return;
    }
    const pos = stage.getPointerPosition() as Vector2d;
    lassoPoints = lassoPoints.concat([pos.x, pos.y]);
    layer.batchDraw();
  });

  stage.on("mouseup touchend", (e) => {
    if (!isPaint) {
      return;
    }
    isPaint = false;
    const pos = stage.getPointerPosition() as Vector2d;
    lassoPoints = lassoPoints.concat([pos.x, pos.y]);
    layer.batchDraw();
  });
};

const test3 = (stage: Stage) => {
  const layer = new Konva.Layer();
  stage.add(layer);

  let lassoPoints: any[] = [];

  const lasso = new Konva.Path({
    stroke: "red",
    strokeWidth: 2,
    dash: [4, 4],
    lineJoin: "round",
    data: "",
    sceneFunc: (context, shape) => {
      // Update the path data
      const data = `M ${lassoPoints[0]} ${lassoPoints[1]} L ${lassoPoints
        .slice(2)
        .join(" ")} Z`;
      shape.setAttr("data", data);

      // Fill the enclosed area with a solid color
      context.fillStyle = "blue";
      context.fillStrokeShape(shape);
    },
  });
  layer.add(lasso);

  let isPaint = false;

  stage.on("mousedown touchstart", (e) => {
    isPaint = true;
    const pos = stage.getPointerPosition() as Vector2d;
    lassoPoints = [pos.x, pos.y];
    layer.batchDraw();
  });

  stage.on("mousemove touchmove", (e) => {
    if (!isPaint) return;
    const pos = stage.getPointerPosition() as Vector2d;
    lassoPoints = lassoPoints.concat([pos.x, pos.y]);
    layer.batchDraw();
  });

  stage.on("mouseup touchend", (e) => {
    if (!isPaint) return;
    isPaint = false;
    const pos = stage.getPointerPosition() as Vector2d;
    lassoPoints = lassoPoints.concat([pos.x, pos.y]);
    layer.batchDraw();
  });
};

const KonvaComponent: Component = () => {
  let konvaDiv = document.createElement("div") as HTMLDivElement;

  onMount(() => {
    removeContextMenu();

    const stage = new Konva.Stage({
      container: konvaDiv,
      width: window.innerWidth,
      height: window.innerHeight - navbarHeight.height,
    });
    test1(stage);
  });

  return <div class="fixed z-[900]" ref={konvaDiv}></div>;
};

export default KonvaComponent;
