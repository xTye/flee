import {
  collection,
  updateDoc,
  doc as refDoc,
  getDoc,
} from "firebase/firestore";
import { CalendarClass } from "../classes/CalendarClass";
import { DateInterface } from "../types/DateType";
import { firebaseStore } from "..";

export const useFetchDate = async (id: string) => {
  const doc = await getDoc(refDoc(firebaseStore, "dates", id));

  const date = doc.data() as DateInterface;

  CalendarClass.validDate(date);

  return date;
};

export const useUpdateDate = async (id: string, date: DateInterface) => {
  CalendarClass.validDate(date);

  await updateDoc(refDoc(firebaseStore, "dates", id), {
    day: date.day,
    month: date.month,
    year: date.year,
    era: date.era,
    updatedAt: new Date(),
  });
};
