import { Component, Show, createSignal } from "solid-js";
import {
  useFetchCharactersFromQuery,
  useUpdateDatabaseCharacter,
} from "../../services/CharacterService";
import LoadingRingComponent from "../utils/LoadingRingComponent";
import { CharacterInterface } from "../../types/CharacterType";
import SearchBarComponent from "../utils/SearchBarComponent";
import ModalComponent from "../ModalComponent";
import ImageCropperEditorComponent from "../utils/ImageCropperEditorComponent";
import QuickCreateCharacterComponent from "./QuickCreateCharacterComponent";

const SlideshowMenuComponent: Component<{
  characterDragEnd?: (e: DragEvent, character: CharacterInterface) => void;
}> = (props) => {
  const [selectedCharacter, setSelectedCharacter] =
    createSignal<CharacterInterface>();
  const [loading, setLoading] = createSignal({
    database: false,
  });
  const [modal, setModal] = createSignal(false);

  let dragCharacter: CharacterInterface;

  return (
    <>
      <Show when={modal()}>
        <ModalComponent setModal={setModal}>
          <QuickCreateCharacterComponent setModal={setModal} />
        </ModalComponent>
      </Show>
      <div class="flex flex-col gap-2 bg-lightPurple p-2 rounded-t-md">
        <div class="flex items-center justify-between gap-1">
          <SearchBarComponent
            useFetch={useFetchCharactersFromQuery}
            itemComponent={(character, i, setShowResults) => (
              <>
                <div
                  onClick={async () => {
                    setSelectedCharacter(character);
                    setLoading({ ...loading(), database: true });
                    await useUpdateDatabaseCharacter(character);
                    setLoading({ ...loading(), database: false });
                    setShowResults(false);
                  }}
                  draggable={true}
                  onDragEnter={(e) => {
                    dragCharacter = character;
                    setShowResults(false);
                  }}
                  onDragEnd={(e) => {
                    if (props.characterDragEnd)
                      props.characterDragEnd(e, dragCharacter);
                  }}
                  class="w-full h-full select-none"
                >
                  <div class="flex items-center gap-1">
                    <img src={character.image} class="w-4 h-4 object-cover" />
                    <div class="text-sm">{character.name}</div>
                  </div>
                </div>
              </>
            )}
          />
          <div class="flex items-center gap-1">
            <Show
              when={!loading().database}
              fallback={<LoadingRingComponent />}
            >
              <button
                class="flex items-center justify-center w-8 h-8 bg-yellow rounded-full hover:bg-red text-text"
                onClick={async () => {
                  setLoading({ ...loading(), database: true });
                  await useUpdateDatabaseCharacter();
                  setLoading({ ...loading(), database: false });
                }}
              >
                <img src="/util-images/stop.svg" class="w-4 h-4" />
              </button>
              <button
                class="flex items-center justify-center w-8 h-8 bg-yellow rounded-full hover:bg-red text-text"
                onClick={() => setModal(true)}
              >
                <img src="/util-images/plus.svg" class="w-4 h-4" />
              </button>
            </Show>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideshowMenuComponent;
