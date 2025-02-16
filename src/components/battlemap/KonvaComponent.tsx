import { Component, createSignal, onMount } from "solid-js";
import { removeContextMenu } from "@/utils/removeContextMenu";
import { BattlemapClass } from "@/classes/battlemap/BattlemapClass";
import { KonvaClass } from "@/classes/konva/KonvaClass";

const KonvaComponent: Component<{
  battlemap: BattlemapClass;
  konva: KonvaClass;
}> = (props) => {
  let konvaDiv = document.createElement("div") as HTMLDivElement;
  const [show, setShow] = createSignal(false);

  onMount(() => {
    removeContextMenu();

    props.konva = new KonvaClass(konvaDiv, props.battlemap);

    props.konva.toggle(setShow);
  });

  return (
    <div
      class={`fixed z-[900] ${
        show()
          ? "pointer-events-auto bg-opacity-10"
          : "pointer-events-none bg-opacity-0"
      } bg-black`}
      ref={konvaDiv}
    ></div>
  );
};

export default KonvaComponent;
