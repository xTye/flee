import { Component, Show, createEffect, createSignal } from "solid-js";
import { useCreateImage } from "../../services/ImageService";
import ImageCropperComponent from "./ImageCropperComponent";
import LoadingComponent from "../utils/LoadingComponent";

const ImageCropperModalComponent: Component = () => {
  const [imagePath, setImagePath] = createSignal<string>("maps");
  const [imageName, setImageName] = createSignal<string>("");
  const [imageFile, setImageFile] = createSignal<File>();
  const [imageRotate, setImageRotate] = createSignal(0);
  const [imageCropper, setImageCropper] = createSignal<Cropper>();

  createEffect(() => imageCropper()?.rotateTo(imageRotate()), imageRotate());

  return (
    <>
      <div class="p-6 overflow-hidden text-text">
        <div class="flex flex-col gap-4 overflow-y-auto">
          <div class="flex justify-between items-center">
            <div class="text-5xl">Image Editor</div>
            <Show when={imageCropper()} keyed>
              {(insImageCropper) => (
                <>
                  <button
                    class="px-4 py-2 bg-yellow hover:bg-red active:bg-burgandy rounded-full"
                    onClick={async () => {
                      const canvas = imageCropper()?.getCroppedCanvas();

                      canvas?.toBlob((blob) => {
                        blob
                          ? useCreateImage(
                              `battlemap/${imagePath()}/${imageName()}`,
                              blob
                            )
                          : null;
                      });
                    }}
                  >
                    Upload
                  </button>
                </>
              )}
            </Show>
          </div>
          <div class="flex justify-between">
            <div class="flex items-center gap-4">
              <div class="px-2">Select Image:</div>
              <input
                type="file"
                accept="image/*"
                onInput={(e) => {
                  if (!e.currentTarget.files || !e.currentTarget.files[0])
                    return;
                  const file = e.currentTarget.files[0];
                  setImageName(file.name.split(".")[0]);
                  setImageFile(() => file);
                }}
              />
            </div>
            <div class="flex items-center gap-4">
              <div class="px-2">Rotate</div>
              <input
                type="range"
                min="-180"
                max="180"
                value={imageRotate()}
                onInput={(e) => {
                  setImageRotate(
                    (e.currentTarget as HTMLInputElement).valueAsNumber
                  );
                }}
              />
              <input
                type="text"
                value={imageRotate()}
                class="text-black px-2 w-12 rounded-md"
                onInput={(e) => {
                  const value = Number.parseInt(e.currentTarget.value);
                  if (Number.isNaN(value) || Math.abs(value) > 180) return;
                  setImageRotate(value);
                }}
              />
            </div>
          </div>
          <Show when={imageFile()} keyed>
            {(insImageFile) => (
              <>
                <div class="flex gap-4">
                  <div class="px-2">Name</div>
                  <input
                    type="text"
                    value={imageName()}
                    class="text-black px-2 rounded-md"
                    onInput={(e) => {
                      setImageName(e.currentTarget.value);
                    }}
                  />
                  <select
                    class="text-black rounded-md"
                    onChange={(e) => {
                      setImagePath(e.currentTarget.value);
                    }}
                  >
                    <option selected={imagePath() === "maps"} value="maps">
                      Map
                    </option>
                    <option
                      selected={imagePath() === "characters"}
                      value="characters"
                    >
                      Character
                    </option>
                  </select>
                </div>
                <ImageCropperComponent
                  insImageFile={insImageFile}
                  setImageCropper={setImageCropper}
                />
                <Show when={imageCropper()} fallback={<LoadingComponent />}>
                  <div class="flex gap-4">
                    <button
                      class="px-2 bg-yellow hover:bg-red active:bg-burgandy rounded-full"
                      onClick={() => {
                        imageCropper()?.setAspectRatio(1);
                      }}
                    >
                      1:1
                    </button>
                    <button
                      class="px-2 bg-yellow hover:bg-red active:bg-burgandy rounded-full"
                      onClick={() => {
                        imageCropper()?.setAspectRatio(16 / 9);
                      }}
                    >
                      16:9
                    </button>
                    <button
                      class="px-2 bg-yellow hover:bg-red active:bg-burgandy rounded-full"
                      onClick={() => {
                        const scale = imageCropper()?.getData();
                        if (!scale) return;
                        console.log(scale);
                        imageCropper()?.scale(scale.scaleX * -1, scale.scaleY);
                      }}
                    >
                      FlipX
                    </button>
                    <button
                      class="px-2 bg-yellow hover:bg-red active:bg-burgandy rounded-full"
                      onClick={() => {
                        const scale = imageCropper()?.getData();
                        if (!scale) return;
                        imageCropper()?.scale(scale.scaleX, scale.scaleY * -1);
                      }}
                    >
                      FlipY
                    </button>
                  </div>
                </Show>
              </>
            )}
          </Show>
        </div>
      </div>
    </>
  );
};

export default ImageCropperModalComponent;
