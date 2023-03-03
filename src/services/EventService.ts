import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { CalendarClass } from "../classes/CalendarClass";
import { firebaseStore } from "..";
import { EventInterface } from "../types/EventType";

export const useFetchEvent = async (id?: string) => {
  try {
    const doc = await getDocDecipher(id);

    const data = doc.data();
    if (!data) throw new Error("No data found for event.");

    const date = {
      day: data.day,
      month: data.month,
      year: data.year,
      era: data.era,
    };

    // Validation checking. Throw errors if invalid.
    CalendarClass.validDate(date);

    const event = {
      id: doc.id,
      title: data.title,
      description: data.description,
      contents: data.contents,
      thumbnail: data.thumbnail,
      date,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return event;
  } catch (e) {
    console.log(e);
  }
};

export const useFetchEvents = async () => {
  try {
    const docs = await getDocs(
      query(
        collection(firebaseStore, "events"),
        limit(12),
        orderBy("createdAt", "desc")
      )
    );

    const events: EventInterface[] = [];

    docs.forEach((doc) => {
      const data = doc.data();

      const date = {
        day: data.day,
        month: data.month,
        year: data.year,
        era: data.era,
      };

      // Validation checking. Throw errors if invalid.
      CalendarClass.validDate(date);

      events.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        contents: data.contents,
        thumbnail: data.thumbnail,
        date,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return events;
  } catch (e) {
    console.log(e);
  }
};

const getDocDecipher = async (id?: string) => {
  if (id) return await getDocFromId(id);

  return await getDocMostRecent();
};

const getDocFromId = async (id: string) => {
  return await getDoc(doc(firebaseStore, "events", id));
};

const getDocMostRecent = async () => {
  const res = await getDocs(
    query(
      collection(firebaseStore, "events"),
      limit(1),
      orderBy("createdAt", "desc")
    )
  );

  return res.docs[0];
};
