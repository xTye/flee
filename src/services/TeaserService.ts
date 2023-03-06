import {
  addDoc,
  collection,
  deleteDoc,
  doc as docRef,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { firebaseFunctions, firebaseStore } from "..";
import { TeaserInterface } from "../types/TeaserType";
import { httpsCallable } from "firebase/functions";

export const useFetchTeaser = async (id: string) => {
  try {
    const doc = await getDoc(docRef(firebaseStore, "teasers", id));

    const data = doc.data() as TeaserInterface;
    if (!data) throw new Error("No data found for teaser.");

    const teaser: TeaserInterface = {
      ...data,
      id: doc.id,
    };

    return teaser;
  } catch (e) {
    console.log(e);
  }
};

export const useFetchTeasers = async () => {
  try {
    const docs = await getDocs(
      query(collection(firebaseStore, "teasers"), orderBy("createdAt", "desc"))
    );

    const teasers: TeaserInterface[] = [];

    docs.forEach((doc) => {
      const data = doc.data() as TeaserInterface;

      const teaser = {
        ...data,
        id: doc.id,
      };

      teasers.push(teaser);
    });

    return teasers;
  } catch (e) {
    console.log(e);
  }
};

export const useCreateTeaser = async (
  teaser: TeaserInterface & { at: boolean; publish: boolean }
) => {
  try {
    await addDoc(collection(firebaseStore, "teasers"), {
      content: teaser.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (teaser.publish) {
      const postTeaser = httpsCallable(firebaseFunctions, "postTeaser");
      await postTeaser({
        content: teaser.content,
        at: teaser.at,
      });
    }

    return true;
  } catch (e) {
    console.error(e);
  }

  return false;
};

export const useUpdateTeaser = async (
  teaser: TeaserInterface & { at: boolean; publish: boolean }
) => {
  try {
    await updateDoc(docRef(firebaseStore, "teasers", teaser.id), {
      content: teaser.content,
      updatedAt: new Date(),
    });

    if (teaser.publish) {
      const postTeaser = httpsCallable(firebaseFunctions, "postTeaser");
      await postTeaser({
        content: teaser.content,
        at: teaser.at,
      });
    }

    return true;
  } catch (e) {
    console.error(e);
  }

  return false;
};

export const useDeleteTeaser = async (id: string) => {
  try {
    await deleteDoc(docRef(firebaseStore, "teasers", id));
    return true;
  } catch (e) {
    console.error(e);
  }

  return false;
};
