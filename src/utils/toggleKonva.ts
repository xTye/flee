import { Stage } from "konva/lib/Stage";
import { Setter, onCleanup } from "solid-js";
import { BattlemapInterface } from "../types/BattlemapType";
import { KonvaInterface } from "../types/KonvaType";
import { isFogLayerActive } from "../hooks/battlemap-utils/booleanRelationshipsUtil";

export const toggleKonva = (
  battlemap: BattlemapInterface,
  konva: KonvaInterface,
  setShow: Setter<boolean>
) => {
  const onDrag = (e: MouseEvent) => {
    if (
      battlemap.events.tab !== "fog" &&
      battlemap.events.tab !== "background" &&
      battlemap.events.tab !== "token"
    )
      return;
    if (
      e.button !== 2 ||
      battlemap.events.dragging ||
      !isFogLayerActive(battlemap)
    )
      return;
    konva.e = e;
    setShow(true);
    konva.stage.fire("mousedown");
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
};
