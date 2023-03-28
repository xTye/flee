import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  list,
  ref,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";
import { firebaseStorage } from "..";
import { ImageInterface } from "../types/ImageType";

type Paths = "battlemap/maps" | "battlemap/characters" | "user-images";

export const useCreateImage = async (
  path: string,
  blob: Blob,
  customMetadata: {
    width: string;
    height: string;
  }
) => {
  try {
    await getMetadata(ref(firebaseStorage, path));
    return false;
  } catch (e) {}

  try {
    const res = await uploadBytes(ref(firebaseStorage, path), blob);

    const metadata = res.metadata;
    metadata.customMetadata = customMetadata;

    await updateMetadata(ref(firebaseStorage, path), metadata);

    return res;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const useFetchImagesQuery = async (query: string) => {
  try {
    const res = await list(ref(firebaseStorage, query), { maxResults: 10 });

    const images: ImageInterface[] = [];

    for (const item of res.items) {
      const metadata = await getMetadata(item);
      if (!metadata.customMetadata) continue;

      const url = await getDownloadURL(item);

      images.push({
        name: item.name,
        url,
        fullPath: item.fullPath,
        customMetadata: metadata.customMetadata as {
          width: string;
          height: string;
        },
      });
    }

    return images;
  } catch (e) {
    console.log(e);
  }
};

export const useDeleteImage = async (query: string) => {
  try {
    await deleteObject(ref(firebaseStorage, query));
  } catch (e) {
    console.log(e);
  }
};
