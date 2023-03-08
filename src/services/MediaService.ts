import {
  getDoc,
  doc as docRef,
  getDocs,
  collection,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import {
  set as databaseSet,
  ref as databaseRef,
  get as databaseGet,
  child as databaseChild,
} from "firebase/database";

import { firebaseDatabase, firebaseFunctions, firebaseStore } from "..";
import { MediaInterface } from "../types/MediaType";
import { httpsCallable } from "firebase/functions";

export const useFetchMediaFromId = async (id: string) => {
  try {
    const doc = await getDoc(docRef(firebaseStore, "medias", id));

    const data = doc.data() as MediaInterface;
    if (!data) throw new Error("No data found for music.");

    const media: MediaInterface = {
      ...data,
      id: doc.id,
    };

    return media;
  } catch (e) {
    console.log(e);
  }
};

export const useFetchMedias = async () => {
  try {
    const docs = await getDocs(collection(firebaseStore, "medias"));

    const medias: MediaInterface[] = [];

    docs.forEach((doc) => {
      const data = doc.data() as MediaInterface;

      const media = {
        ...data,
        id: doc.id,
      };

      medias.push(media);
    });

    return medias;
  } catch (e) {
    console.log(e);
  }
};

export const useCreateMedia = async (media: MediaInterface) => {
  try {
    await setDoc(docRef(firebaseStore, "medias", media.id), {
      ...media,
      createdAt: new Date(),
    });

    return true;
  } catch (e) {
    console.log(e);
  }

  return false;
};

export const useDeleteMedia = async (media: MediaInterface) => {
  try {
    await deleteDoc(docRef(firebaseStore, "medias", media.id));
    return true;
  } catch (e) {
    console.log(e);
  }

  return false;
};

export const useFetchMediaFromQuery = async (query: string) => {
  try {
    if (query === "") return [];
    if (query.startsWith("http"))
      query = query.split("https://www.youtube.com/watch?v=")[1];

    const queryYoutube = httpsCallable(firebaseFunctions, "queryYoutube");
    const res = await queryYoutube({
      query,
    });

    const medias = res.data as MediaInterface[];

    return medias;
  } catch (e) {
    console.log(e);
  }
};

export const useUpdateDatabaseMedia = async (
  media: MediaInterface | undefined,
  options?: {
    autoplay?: boolean;
    loop?: boolean;
  }
) => {
  try {
    let src = media
      ? `https://www.youtube.com/embed/${media.id}?${
          options?.autoplay ? "autoplay=1&" : ""
        }${options?.loop ? "loop=1&playlist=" + media.id : ""}`
      : "";

    const snapshot = await databaseGet(
      databaseChild(databaseRef(firebaseDatabase), "music")
    );

    if (!media) src = `https://www.youtube.com/embed/${snapshot.val().id}`;

    if (snapshot.val().id === media?.id)
      await databaseSet(databaseRef(firebaseDatabase, "music/src"), "");

    if (!media)
      return await databaseSet(databaseRef(firebaseDatabase, "music/src"), src);

    await databaseSet(databaseRef(firebaseDatabase, "music"), {
      ...media,
      src,
    });
  } catch (e) {
    console.log(e);
  }
};
