import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc as refDoc,
} from "firebase/firestore";
import { firebaseStore } from "..";
import { MarkerInterface } from "../types/MarkerType";

export const useFetchMarkers = async () => {
  try {
    const docs = await getDocs(collection(firebaseStore, "markers"));

    const markers: MarkerInterface[] = [];

    for (const doc of docs.docs) {
      const data = doc.data() as MarkerInterface;

      const marker: MarkerInterface = {
        ...data,
        id: doc.id,
      };

      markers.push(marker);
    }

    return markers;
  } catch (e) {
    console.log(e);
  }
};

export const useCreateMarker = async (marker: MarkerInterface) => {
  try {
    const doc = await addDoc(collection(firebaseStore, "markers"), {
      ...marker,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return doc.id;
  } catch (e) {
    console.log(e);
  }
};

export const useUpdateMarker = async (id: string, marker: MarkerInterface) => {
  try {
    await updateDoc(refDoc(firebaseStore, "markers", id), {
      ...marker,
      updatedAt: new Date(),
    });
  } catch (e) {
    console.log(e);
  }
};
