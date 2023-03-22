import { getDownloadURL, list, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "..";
import { ImageInterface } from "../types/ImageType";

type Paths = "battlemap/maps" | "battlemap/characters" | "user-images";

export const useCreateImage = async (path: string, blob: Blob) => {
  try {
    return await uploadBytes(ref(firebaseStorage, path), blob);
  } catch (e) {
    console.error(e);
  }
};

export const useFetchImagesQuery = async (query: string) => {
  try {
    const res = await list(ref(firebaseStorage, query), { maxResults: 10 });

    const images: ImageInterface[] = [];

    for (const item of res.items) {
      const url = await getDownloadURL(item);

      images.push({
        name: item.name,
        url,
      });
    }

    return images;
  } catch (e) {
    console.log(e);
  }
};
