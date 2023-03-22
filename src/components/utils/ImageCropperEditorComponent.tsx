import {
  Accessor,
  Component,
  Setter,
  Show,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import ImageCropperComponent from "./ImageCropperComponent";
import LoadingComponent from "../utils/LoadingComponent";
import { pasteFile } from "../../utils/pasteFile";

const ImageCropperEditorComponent: Component<{
  parent?: {
    imageFile: Accessor<File | undefined>;
    setImageFile: Setter<File | undefined>;
    imageCropper: Accessor<Cropper | undefined>;
    setImageCropper: Setter<Cropper | undefined>;
  };
}> = (props) => {
  let [imageFile, setImageFile] = createSignal<File>();
  let [imageCropper, setImageCropper] = createSignal<Cropper>();
  if (props.parent) {
    imageFile = props.parent.imageFile;
    setImageFile = props.parent.setImageFile;
    imageCropper = props.parent.imageCropper;
    setImageCropper = props.parent.setImageCropper;
  }
  const [imageRotate, setImageRotate] = createSignal(0);

  let fileRef = document.createElement("input") as HTMLInputElement;

  createEffect(() => imageCropper()?.rotateTo(imageRotate()), imageRotate());

  onMount(() => {
    pasteFile(fileRef, setImageFile);
  });

  return (
    <>
      <div class="overflow-hidden text-text">
        <div class="flex flex-col gap-4 overflow-y-auto">
          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class={`flex flex-col items-center justify-center ${
                imageFile() ? "w-full" : "w-96 h-64"
              } border-2 border-dashed rounded-lg cursor-pointer hover:bg-lightPurple`}
            >
              <div class="flex flex-col items-center justify-center py-6">
                <svg
                  aria-hidden="true"
                  class={`${
                    !imageFile() || "hidden"
                  } w-10 h-10 mb-3 text-gray-400`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and
                  drop
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  or <span class="font-semibold">paste</span> image or url
                </div>
              </div>
              <input
                ref={fileRef}
                id="dropzone-file"
                type="file"
                accept="image/*"
                class="hidden"
                onInput={(e) => {
                  if (!e.currentTarget.files || !e.currentTarget.files[0])
                    return;
                  const file = e.currentTarget.files[0];
                  setImageFile(() => file);
                }}
              />
            </label>
          </div>
          <Show when={imageFile()} keyed>
            {(insImageFile) => (
              <>
                <ImageCropperComponent
                  insImageFile={insImageFile}
                  setImageCropper={setImageCropper}
                />
                <Show when={imageCropper()} fallback={<LoadingComponent />}>
                  <div class="flex justify-between items-center">
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
                          imageCropper()?.setAspectRatio(NaN);
                        }}
                      >
                        Free
                      </button>
                      <button
                        class="px-2 bg-yellow hover:bg-red active:bg-burgandy rounded-full"
                        onClick={() => {
                          const c = imageCropper();
                          if (!c) return;
                          const width = c.getCanvasData().naturalWidth;
                          const height = c.getCanvasData().naturalHeight;
                          imageCropper()?.setAspectRatio(width / height);
                          imageCropper()?.setCropBoxData({
                            top: c.getCanvasData().top,
                            left: c.getCanvasData().left,
                            width: c.getCanvasData().width,
                            height: c.getCanvasData().height,
                          });
                        }}
                      >
                        Full
                      </button>
                      <button
                        class="px-2 bg-yellow hover:bg-red active:bg-burgandy rounded-full"
                        onClick={() => {
                          const scale = imageCropper()?.getData();
                          if (!scale) return;
                          imageCropper()?.scale(
                            scale.scaleX * -1,
                            scale.scaleY
                          );
                        }}
                      >
                        FlipX
                      </button>
                      <button
                        class="px-2 bg-yellow hover:bg-red active:bg-burgandy rounded-full"
                        onClick={() => {
                          const scale = imageCropper()?.getData();
                          if (!scale) return;
                          imageCropper()?.scale(
                            scale.scaleX,
                            scale.scaleY * -1
                          );
                        }}
                      >
                        FlipY
                      </button>
                    </div>
                    <div class="flex justify-center items-center gap-4">
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
                          if (Number.isNaN(value) || Math.abs(value) > 180)
                            return;
                          setImageRotate(value);
                        }}
                      />
                    </div>
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

export default ImageCropperEditorComponent;
