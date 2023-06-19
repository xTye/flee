import { Component, Setter, Show, createSignal } from "solid-js";
import ImageCropperEditorComponent from "../utils/ImageCropperEditorComponent";
import LoadingComponent from "../utils/LoadingComponent";
import { useQuickCreateCharacter } from "../../services/CharacterService";
import { useCreateImage } from "../../services/ImageService";

type BackgroundImageType = "maps" | "assets";

const CreateBackgroundImageComponent: Component<{
  setModal?: Setter<boolean>;
}> = (props) => {
  const [image, setImage] = createSignal({
    name: "",
    type: "maps",
    queryBegin: "/battlemap/",
  });
  const [imageFile, setImageFile] = createSignal<File>();
  const [imageCropper, setImageCropper] = createSignal<Cropper>();
  const [loading, setLoading] = createSignal({
    firestore: false,
  });

  return (
    <>
      <div class="flex flex-col gap-4 p-6">
        <Show when={!loading().firestore} fallback={<LoadingComponent />}>
          <Show when={image().name !== "" && imageFile()}>
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
                    let res;

                    if (blob)
                      res = await useCreateImage(
                        `${image().queryBegin}${image().type}/${image().name}`,
                        blob,
                        {
                          width: canvas.width.toString(),
                          height: canvas.height.toString(),
                        }
                      );

                    setLoading({
                      ...loading(),
                      firestore: false,
                    });

                    if (res) props.setModal?.(false);
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
                setImage({
                  ...image(),
                  name: e.currentTarget.value,
                });
              }}
            />
            <select
              class="text-black rounded-md"
              onChange={(e) => {
                setImage({
                  ...image(),
                  type: e.currentTarget.value as BackgroundImageType,
                });
              }}
            >
              <option selected={image().type === "maps"} value="maps">
                Maps
              </option>
              <option selected={image().type === "assets"} value="assets">
                Assets
              </option>
            </select>
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

export default CreateBackgroundImageComponent;
