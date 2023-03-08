import { Component, Setter, onMount } from "solid-js";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { useCropper } from "../../hooks/CropperHooks";

const ImageCropperComponent: Component<{
  insImageFile: File;
  setImageCropper: Setter<Cropper>;
}> = (props) => {
  let image = document.createElement("img") as HTMLImageElement;
  let cropper: Cropper;

  onMount(() => {
    cropper = useCropper(image);
    props.setImageCropper(cropper);
  });

  return (
    <>
      <div class="max-h-[400px]">
        <img
          id="image"
          ref={image}
          src={URL.createObjectURL(props.insImageFile)}
          class="block max-w-full"
        />
      </div>
    </>
  );
};

export default ImageCropperComponent;
