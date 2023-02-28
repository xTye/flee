import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc as refDoc,
} from "firebase/firestore";
import { firebaseStore } from "..";

export interface Marker {
  name: string;
  description: string;
  x: number;
  y: number;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
  previousData?: Marker;
}

export const useFetchMarkers = async () => {
  try {
    const docs = await getDocs(collection(firebaseStore, "markers"));

    const markers: Marker[] = [];

    for (const doc of docs.docs) {
      const data = doc.data();

      const marker: Marker = {
        name: data.name,
        description: data.description,
        x: data.x,
        y: data.y,
        color: data.color,
      };

      markers.push(marker);
    }

    return markers;
  } catch (e: any) {
    console.error(e.message);
  }
};

export const useCreateMarker = async (marker: Marker) => {
  try {
    const doc = await addDoc(collection(firebaseStore, "markers"), {
      ...marker,
      createdAt: new Date(),
    });

    return doc.id;
  } catch (e: any) {
    console.error(e.message);
  }
};

export const useUpdateMarker = async (id: string, marker: Marker) => {
  try {
    await updateDoc(refDoc(firebaseStore, "markers", id), {
      ...marker,
      updatedAt: new Date(),
    });
  } catch (e: any) {
    console.error(e.message);
  }
};
