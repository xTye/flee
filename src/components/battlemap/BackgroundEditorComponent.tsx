import { Component, Setter, createSignal } from "solid-js";
import SearchBarComponent from "../utils/SearchBarComponent";
import {
  useDeleteImage,
  useFetchImagesQuery,
} from "../../services/ImageService";
import {
  changeBackgroundImage,
  useRemoveBackgroundImage,
} from "../../hooks/BattlemapHooks";
import { useModal } from "../utils/ModalContext";
import QuickCreateCharacterComponent from "./QuickCreateCharacterComponent";
import CreateBackgroundImageComponent from "./CreateBackgroundImageComponent";
import { ImageInterface } from "../../types/ImageType";
import { BattlemapClass } from "../../classes/battlemap/BattlemapClass";

type BackgroundImageType = "maps" | "assets";

const BackgroundEditorComponent: Component<{
  battlemap: BattlemapClass;
}> = (props) => {
  const [content, actions] = useModal();
  const battlemap = props.battlemap;

  const [queryBegin, setQueryBegin] = createSignal<BackgroundImageType>("maps");

  //! "any" is not good. This will change when I figure out how to type this.
  const [options, setOptions] = createSignal<any>({
    movable: {
      type: "none",
      by: "grid",
    },
    scale: 1,
    rotation: 0,
  });

  return (
    <>
      <div class="flex items-center gap-1">
        <SearchBarComponent
          queryBegin={`/battlemap/${queryBegin()}/`}
          useFetch={useFetchImagesQuery}
          itemComponent={(
            backgroundImage: ImageInterface,
            i,
            setShowResults,
            refetch
          ) => (
            <>
              <div
                draggable={queryBegin() === "assets" || queryBegin() === "maps"}
                onDragEnter={(e) => {
                  if (queryBegin() === "assets" || queryBegin() === "maps")
                    return;
                  setShowResults(false);
                }}
                onDragEnd={(e) => {
                  if (queryBegin() === "assets")
                    useCreateBackgroundImage(e, battlemap, backgroundImage);

                  if (queryBegin() === "maps")
                    changeBackgroundImage(battlemap, backgroundImage);
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

                  <button
                    class="p-1 rounded-md hover:bg-red"
                    onClick={async () => {
                      await useDeleteImage(backgroundImage.fullPath);

                      if (queryBegin() === "maps") {
                        if (battlemap.background.url === backgroundImage.url)
                          changeBackgroundImage(battlemap, {
                            url: "/battlemap-images/blank.svg",
                            name: "Blank",
                            fullPath: "/",
                            customMetadata: {
                              width: "1",
                              height: "1",
                            },
                          });

                        refetch();
                      } else if (queryBegin() === "assets") {
                        for (const [key, asset] of battlemap.background.assets)
                          if (asset.url === backgroundImage.url)
                            useRemoveBackgroundImage(battlemap, asset);

                        refetch();
                      }
                    }}
                  >
                    <img
                      src={"/util-images/trash.svg"}
                      class="w-4 h-4 object-cover"
                    />
                  </button>
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
        <button
          class="p-2 bg-yellow rounded-full hover:bg-red"
          onClick={() => {
            actions.open(
              <CreateBackgroundImageComponent
                setModal={actions.close as Setter<boolean>}
              />
            );
          }}
        >
          <img src="/util-images/plus.svg" class="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

export default BackgroundEditorComponent;
