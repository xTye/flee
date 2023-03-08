import { Component, Setter, Show, createSignal } from "solid-js";
import ImageCropperEditorComponent from "../utils/ImageCropperEditorComponent";
import { CharacterInterfaceDefault } from "../../types/CharacterType";
import LoadingComponent from "../utils/LoadingComponent";
import { useQuickCreateCharacter } from "../../services/CharacterService";

const QuickCreateCharacterComponent: Component<{
  setModal?: Setter<boolean>;
}> = (props) => {
  const [character, setCharacter] = createSignal(CharacterInterfaceDefault);
  const [imageFile, setImageFile] = createSignal<File>();
  const [imageCropper, setImageCropper] = createSignal<Cropper>();
  const [loading, setLoading] = createSignal({
    firestore: false,
  });

  return (
    <>
      <div class="flex flex-col gap-4 p-6">
        <Show when={!loading().firestore} fallback={<LoadingComponent />}>
          <Show when={character().name !== "" && imageFile()}>
            <div class="flex justify-between items-center">
              <button
                class="px-4 py-2 bg-yellow hover:bg-red active:bg-burgandy rounded-full"
                onClick={async () => {
                  const canvas = imageCropper()?.getCroppedCanvas();

                  setLoading({
                    ...loading(),
                    firestore: true,
                  });

                  canvas?.toBlob(async (blob: Blob | null) => {
                    if (blob) await useQuickCreateCharacter(character(), blob);

                    setLoading({
                      ...loading(),
                      firestore: false,
                    });
                    props.setModal?.(false);
                  });
                }}
              >
                Upload
              </button>
            </div>
          </Show>
        </Show>
        <div class="flex items-center justify-between text-text">
          <div class="flex items-center gap-4">
            <div class="text-sm">Name</div>
            <input
              type="text"
              class="text-black rounded-md"
              onInput={(e) => {
                setCharacter({
                  ...character(),
                  name: e.currentTarget.value,
                });
              }}
            />
          </div>
          <div class="flex items-center gap-4">
            <input
              type="checkbox"
              checked={character().hidden}
              class="w-4 h-4"
              onInput={() => {
                setCharacter({
                  ...character(),
                  hidden: !character().hidden,
                });
              }}
            />
            <div>Hidden</div>
          </div>
        </div>
        <ImageCropperEditorComponent
          parent={{
            imageFile,
            setImageFile,
            imageCropper,
            setImageCropper,
          }}
        />
      </div>
    </>
  );
};

export default QuickCreateCharacterComponent;
