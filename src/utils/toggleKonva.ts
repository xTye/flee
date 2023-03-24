import { Stage } from "konva/lib/Stage";
import { Setter, onCleanup } from "solid-js";
import { BattlemapInterface } from "../types/BattlemapType";
import { KonvaInterface } from "../types/KonvaType";

export const toggleKonva = (
  battlemap: BattlemapInterface,
  konva: KonvaInterface,
  setShow: Setter<boolean>
) => {
  const onDrag = (e: MouseEvent) => {
    if (e.button !== 2 || battlemap.events.dragging) return;
    konva.lasso.e = e;
    setShow(true);
    konva.stage.fire("mousedown");
  };

  const onDragEnd = (e: any) => {
    if (e.button !== 2 || battlemap.events.dragging) return;
    setShow(false);
  };

  document.body.addEventListener("mousedown", onDrag);
  document.body.addEventListener("mouseup", onDragEnd);

  onCleanup(() => {
    document.body.removeEventListener("mousedown", onDrag);
    document.body.removeEventListener("mouseup", onDragEnd);
  });
};
