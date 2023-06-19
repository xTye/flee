import { Component, Show, createEffect, createSignal } from "solid-js";
import MapToolComponent from "../utils/MapToolComponent";
import GridEditorComponent from "./GridEditorComponent";
import TokenEditorComponent from "./TokenEditorComponent";
import BackgroundEditorComponent from "./BackgroundEditorComponent";
import { KonvaInterface, KonvaToolType } from "../../types/KonvaType";
import FogEditorComponent from "./FogEditorComponent";
import BattlemapEditorMenuComponent from "./BattlemapEditorMenuComponent";
import { BattlemapClass } from "../../classes/battlemap/BattlemapClass";
import { TabType } from "../../classes/battlemap/EventDataClass";

const BattlemapEditorComponent: Component<{
  battlemap: BattlemapClass;
  konva: KonvaInterface;
}> = (props) => {
  const battlemap = props.battlemap;
  const konva = props.konva;

  // TODO - make this apart of the battlemap state
  const [selectedTab, setSelectedTab] = createSignal<TabType>("pages");

  createEffect(() => {
    const token = battlemap.token.selected();
    if (token) setSelectedTab("token");
  });

  return (
    <>
      <MapToolComponent>
        <BattlemapEditorMenuComponent
          battlemap={battlemap}
          konva={konva}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <Show when={selectedTab() === "pages"}>
          <div>Pages is still in development</div>
        </Show>
        <Show when={selectedTab() === "background"}>
          <BackgroundEditorComponent battlemap={battlemap} />
        </Show>
        <Show when={selectedTab() === "grid"}>
          <GridEditorComponent battlemap={battlemap} />
        </Show>
        <Show when={selectedTab() === "token"}>
          <TokenEditorComponent battlemap={battlemap} />
        </Show>
        <Show when={selectedTab() === "fog"}>
          <FogEditorComponent battlemap={battlemap} />
        </Show>
      </MapToolComponent>
    </>
  );
};

export default BattlemapEditorComponent;
