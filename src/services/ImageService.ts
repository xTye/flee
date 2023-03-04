import { ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "..";

type Paths = "battlemap/maps" | "battlemap/characters" | "user-images";

export const useCreateImage = async (path: string, blob: Blob) => {
  try {
    console.log(blob);
    await uploadBytes(ref(firebaseStorage, path), blob);
  } catch (e) {
    console.error(e);
  }
};
