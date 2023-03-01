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
      const data = doc.data();

      const marker: MarkerInterface = {
        id: doc.id,
        name: data.name,
        description: data.description,
        x: data.x,
        y: data.y,
        color: data.color,
        maps: data.maps,
      };

      markers.push(marker);
    }

    return markers;
  } catch (e: any) {
    console.error(e.message);
  }
};

export const useCreateMarker = async (marker: MarkerInterface) => {
  const doc = await addDoc(collection(firebaseStore, "markers"), {
    ...marker,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return doc.id;
};

export const useUpdateMarker = async (id: string, marker: MarkerInterface) => {
  await updateDoc(refDoc(firebaseStore, "markers", id), {
    ...marker,
    updatedAt: new Date(),
  });
};
