import { Component, Show, createSignal } from "solid-js";
import { BattlemapInterface } from "../../types/BattlemapType";
import SearchBarComponent from "../utils/SearchBarComponent";
import { useFetchImagesQuery } from "../../services/ImageService";
import { useCreateBackgroundImage } from "../../hooks/BattlemapHooks";
import ModalComponent from "../ModalComponent";

type BackgroundImageType = "maps" | "assets";

const BackgroundEditorComponent: Component<{
  battlemap: BattlemapInterface;
}> = (props) => {
  const battlemap = props.battlemap;

  const [queryBegin, setQueryBegin] = createSignal<BackgroundImageType>("maps");
  const [modal, setModal] = createSignal(false);

  return (
    <>
      <Show when={modal()}>
        <ModalComponent setModal={setModal}>
          {/* <QuickCreateCharacterComponent setModal={setModal} /> */}
        </ModalComponent>
      </Show>
      <div class="flex items-center gap-1">
        <SearchBarComponent
          queryBegin={`/battlemap/${queryBegin()}/`}
          useFetch={useFetchImagesQuery}
          itemComponent={(result, i) => <div>{result.name}</div>}
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
          class="w-10 h-10 bg-yellow rounded-full hover:bg-red"
          onClick={() => setModal(true)}
        >
          <img src="/util-images/plus.svg" class="w-4 h-4" />
        </button>
      </div>
      <img
        src="/campaign-images/logo-edited.png"
        class="w-12 h-12 object-cover"
        draggable
        onDragEnd={(e) => {
          useCreateBackgroundImage(e, battlemap);
        }}
      />
    </>
  );
};

export default BackgroundEditorComponent;
