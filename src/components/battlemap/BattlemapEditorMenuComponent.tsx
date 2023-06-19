import {
  Accessor,
  Component,
  Setter,
  createEffect,
  createSignal,
} from "solid-js";
import { KonvaInterface, KonvaToolType } from "../../types/KonvaType";
import { BattlemapClass } from "../../classes/battlemap/BattlemapClass";
import { TabType } from "../../classes/battlemap/EventDataClass";

const BattlemapEditorMenuComponent: Component<{
  battlemap: BattlemapClass;
  konva: KonvaInterface;
  selectedTab: Accessor<TabType>;
  setSelectedTab: Setter<TabType>;
}> = (props) => {
  const battlemap = props.battlemap;
  const konva = props.konva;
  const selectedTab = props.selectedTab;
  const setSelectedTab = props.setSelectedTab;

  const [konvaTool, setKonvaTool] = createSignal<KonvaToolType>("line");

  createEffect(() => {
    const token = battlemap.token.selected();
    if (token) setSelectedTab("token");
  });

  return (
    <>
      <div class="flex items-center justify-between">
        <div class="flex items-center w gap-4 border-b border-black">
          <button
            class={`${
              selectedTab() === "pages" && "border-t border-x border-black"
            } p-2 rounded-t-md hover:bg-lightPurple`}
            onClick={(e) => {
              battlemap.events.tab = "pages";
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
              battlemap.events.tab = "background";
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
              battlemap.events.tab = "grid";
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
              battlemap.events.tab = "token";
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
              battlemap.events.tab = "fog";
              setSelectedTab("fog");
            }}
          >
            <img src="/util-images/fog.svg" class="w-4 h-4" />
          </button>
        </div>
        <div class="flex gap-1">
          <div class="flex flex-col gap-1">
            <div
              class={`${
                konvaTool() === "line" && "bg-red"
              } rounded-full hover:bg-lightPurple w-2 h-2`}
            ></div>
            <div
              class={`${
                konvaTool() === "rect" && "bg-red"
              } rounded-full hover:bg-lightPurple w-2 h-2`}
            ></div>
            <div
              class={`${
                konvaTool() === "circle" && "bg-red"
              } rounded-full hover:bg-lightPurple w-2 h-2`}
            ></div>
          </div>

          <div class="flex flex-col gap-1">
            <button
              class={`${
                konvaTool() === "line" && ""
              } rounded-md hover:bg-lightPurple`}
              onClick={(e) => {
                konva.tool = "line";
                setKonvaTool("line");
              }}
            >
              <img src="/util-images/lasso.svg" class="w-2 h-2" />
            </button>
            <button
              class={`${
                konvaTool() === "rect" && ""
              } rounded-md hover:bg-lightPurple`}
              onClick={(e) => {
                konva.tool = "rect";
                setKonvaTool("rect");
              }}
            >
              <img src="/util-images/square.svg" class="w-2 h-2" />
            </button>
            <button
              class={`${
                konvaTool() === "circle" && ""
              } rounded-md hover:bg-lightPurple`}
              onClick={(e) => {
                konva.tool = "circle";
                setKonvaTool("circle");
              }}
            >
              <img src="/util-images/circle.svg" class="w-2 h-2" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BattlemapEditorMenuComponent;
