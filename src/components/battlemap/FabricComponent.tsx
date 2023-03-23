import { Component, onMount } from "solid-js";
import { fabric } from "fabric";
import { navbarHeight } from "../navbar/NavbarComponent";

const FabricComponent: Component = () => {
  onMount(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: window.innerWidth,
      height: window.innerHeight - navbarHeight.height,
    });

    let points: any[] = [];

    const lasso = new fabric.Polygon([], {
      stroke: "red",
      strokeWidth: 2,
      fill: "blue",
      opacity: 0.5,
    });

    canvas.on("mouse:down", (options: any) => {
      console.log("Test");
      const { e } = options;
      const pointer = canvas.getPointer(e);
      points.push(pointer.x, pointer.y);
      lasso.set({ points });
      canvas.add(lasso);
    });

    canvas.on("mouse:move", (options: any) => {
      if (!lasso) {
        return;
      }
      const { e } = options;
      const pointer = canvas.getPointer(e);
      points[points.length - 2] = pointer.x;
      points[points.length - 1] = pointer.y;
      lasso.set({ points });
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      lasso.setCoords();
      canvas.remove(lasso);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    });
  });

  return <canvas id="canvas"></canvas>;
};

export default FabricComponent;
