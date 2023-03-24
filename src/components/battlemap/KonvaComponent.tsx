import { Component, createSignal, onMount } from "solid-js";
import { removeContextMenu } from "../../utils/removeContextMenu";
import { toggleKonva } from "../../utils/toggleKonva";
import Konva from "konva";
import { useKonvaStage } from "../../hooks/KonvaHooks";
import { BattlemapInterface } from "../../types/BattlemapType";
import { KonvaInterface } from "../../types/KonvaType";

const KonvaComponent: Component<{
  battlemap: BattlemapInterface;
}> = (props) => {
  let konvaDiv = document.createElement("div") as HTMLDivElement;
  const konva = {} as KonvaInterface;
  const [show, setShow] = createSignal(false);

  onMount(() => {
    removeContextMenu();

    useKonvaStage(konvaDiv, konva, props.battlemap);

    toggleKonva(props.battlemap, konva, setShow);
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
