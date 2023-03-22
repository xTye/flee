import { Component, Show, createEffect, createSignal } from "solid-js";
import MapToolComponent from "../utils/MapToolComponent";
import { BattlemapInterface } from "../../types/BattlemapType";
import GridEditorComponent from "./GridEditorComponent";
import TokenEditorComponent from "./TokenEditorComponent";
import BackgroundEditorComponent from "./BackgroundEditorComponent";

type TabType = "pages" | "background" | "grid" | "token" | "fog";

const BattlemapEditorComponent: Component<{
  battlemap: BattlemapInterface;
}> = (props) => {
  const battlemap = props.battlemap;

  const [selectedTab, setSelectedTab] = createSignal<TabType>("pages");

  createEffect(() => {
    const token = battlemap.token.selected();
    if (token) setSelectedTab("token");
  });

  return (
    <>
      <MapToolComponent>
        <div class="flex items-center gap-4 pl-2 border-b border-black">
          <button
            class={`${
              selectedTab() === "pages" && "border-t border-x border-black"
            } p-2 rounded-t-md hover:bg-lightPurple`}
            onClick={(e) => {
              setSelectedTab("pages");
            }}
          >
            <img src="/util-images/pages.svg" class="w-4 h-4" />
          </button>
          <button
            class={`${
              selectedTab() === "background" && "border-t border-x border-black"
            } p-2 rounded-t-md hover:bg-lightPurple`}
            onClick={(e) => {
              setSelectedTab("background");
            }}
          >
            <img src="/util-images/background.svg" class="w-4 h-4" />
          </button>
          <button
            class={`${
              selectedTab() === "grid" && "border-t border-x border-black"
            } p-2 rounded-t-md hover:bg-lightPurple`}
            onClick={(e) => {
              setSelectedTab("grid");
            }}
          >
            <img src="/util-images/grid.svg" class="w-4 h-4" />
          </button>
          <button
            class={`${
              selectedTab() === "token" && "border-t border-x border-black"
            } p-2 rounded-t-md hover:bg-lightPurple`}
            onClick={(e) => {
              setSelectedTab("token");
            }}
          >
            <img src="/util-images/token.svg" class="w-4 h-4" />
          </button>
          <button
            class={`${
              selectedTab() === "fog" && "border-t border-x border-black"
            } p-2 rounded-t-md hover:bg-lightPurple`}
            onClick={(e) => {
              setSelectedTab("fog");
            }}
          >
            <img src="/util-images/fog.svg" class="w-4 h-4" />
          </button>
        </div>
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
          <div>Fog is still in development</div>
        </Show>
      </MapToolComponent>
    </>
  );
};

export default BattlemapEditorComponent;
