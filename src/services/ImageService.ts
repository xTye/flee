import { list, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "..";

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

    const images = res.items.map((item) => {
      return {
        name: item.name,
        url: item.fullPath,
      };
    });

    return images;
  } catch (e) {
    console.log(e);
  }
};
