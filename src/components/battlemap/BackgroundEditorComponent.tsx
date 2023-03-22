import { Component, Setter, createSignal } from "solid-js";
import { BattlemapInterface } from "../../types/BattlemapType";
import SearchBarComponent from "../utils/SearchBarComponent";
import { useFetchImagesQuery } from "../../services/ImageService";
import {
  changeBackgroundImage,
  useCreateBackgroundImage,
} from "../../hooks/BattlemapHooks";
import { useModal } from "../utils/ModalContext";
import QuickCreateCharacterComponent from "./QuickCreateCharacterComponent";
import CreateBackgrouundImageComponent from "./CreateBackgroundImageComponent";
import { ImageInterface } from "../../types/ImageType";

type BackgroundImageType = "maps" | "assets";

const BackgroundEditorComponent: Component<{
  battlemap: BattlemapInterface;
}> = (props) => {
  const [content, actions] = useModal();
  const battlemap = props.battlemap;

  const [queryBegin, setQueryBegin] = createSignal<BackgroundImageType>("maps");

  return (
    <>
      <div class="flex items-center justify-end gap-1">
        <button
          class="p-2 bg-yellow rounded-full hover:bg-red"
          onClick={() => {
            actions.open(
              <CreateBackgrouundImageComponent
                setModal={actions.close as Setter<boolean>}
              />
            );
          }}
        >
          <img src="/util-images/plus.svg" class="w-4 h-4" />
        </button>
      </div>
      <div class="flex items-center gap-1">
        <SearchBarComponent
          queryBegin={`/battlemap/${queryBegin()}/`}
          useFetch={useFetchImagesQuery}
          itemComponent={(
            backgroundImage: ImageInterface,
            i,
            setShowResults
          ) => (
            <>
              <div
                onClick={async () => {
                  if (queryBegin() !== "maps") return;
                  changeBackgroundImage(battlemap, backgroundImage);
                  setShowResults(false);
                }}
                draggable={queryBegin() === "assets"}
                onDragEnter={(e) => {
                  if (queryBegin() !== "assets") return;
                  setShowResults(false);
                }}
                onDragEnd={(e) => {
                  if (queryBegin() !== "assets") return;
                  useCreateBackgroundImage(e, battlemap, backgroundImage);
                }}
                class="w-full h-full select-none"
              >
                <div class="flex items-center gap-1 justify-between">
                  <div class="flex items-center gap-1">
                    <img
                      src={backgroundImage.url}
                      class="w-4 h-4 object-cover"
                    />
                    <div class="text-sm">{backgroundImage.name}</div>
                  </div>

                  <img
                    src={"/util-images/trash.svg"}
                    class="w-4 h-4 object-cover hover:bg-red"
                  />
                </div>
              </div>
            </>
          )}
        />
        <select
          class="text-black rounded-md"
          onChange={(e) => {
            setQueryBegin(e.currentTarget.value as BackgroundImageType);
          }}
        >
          <option selected={queryBegin() === "maps"} value="maps">
            Maps
          </option>
          <option selected={queryBegin() === "assets"} value="assets">
            Assets
          </option>
        </select>
      </div>
    </>
  );
};

export default BackgroundEditorComponent;
