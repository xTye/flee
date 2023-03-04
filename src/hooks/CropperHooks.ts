import Cropper from "cropperjs";

export const useCropper = (image: HTMLImageElement) => {
  return new Cropper(image, {
    aspectRatio: 1,
    crop(event) {},
  });
};
