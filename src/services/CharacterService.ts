import {
  addDoc,
  collection,
  doc as docRef,
  getDoc,
  getDocs,
  limit,
  query as queryRef,
  setDoc,
  where as whereRef,
} from "firebase/firestore";
import { firebaseDatabase, firebaseStore } from "..";
import { CharacterInterface } from "../types/CharacterType";
import {
  child as databaseChild,
  get as databaseGet,
  ref as databaseRef,
  set as databaseSet,
} from "firebase/database";
import { useCreateImage } from "./ImageService";
import { getDownloadURL } from "firebase/storage";

export const useFetchCharacter = async (id: string) => {
  try {
    const doc = await getDoc(docRef(firebaseStore, "characters", id));

    const data = doc.data() as CharacterInterface;
    if (!data) throw new Error("No data found for character.");

    const character: CharacterInterface = {
      ...data,
      id: doc.id,
    };

    return character;
  } catch (e) {
    console.log(e);
  }
};

// If hide parameter is true, query for characters that aren't hidden.
export const useFetchCharacters = async (hide = true) => {
  try {
    const docs = hide
      ? await getDocs(
          queryRef(
            collection(firebaseStore, "characters"),
            whereRef("hidden", "==", false)
          )
        )
      : await getDocs(collection(firebaseStore, "characters"));

    const characters: CharacterInterface[] = [];

    docs.forEach((doc) => {
      const data = doc.data() as CharacterInterface;

      const character = {
        ...data,
        id: doc.id,
      };

      characters.push(character);
    });

    return characters;
  } catch (e) {
    console.log(e);
  }
};

export const useFetchCharactersFromQuery = async (query: string) => {
  try {
    const docs = await getDocs(
      queryRef(
        collection(firebaseStore, "characters"),
        whereRef("name", "<=", query),
        limit(10)
      )
    );

    const characters: CharacterInterface[] = [];

    docs.forEach((doc) => {
      const data = doc.data() as CharacterInterface;

      const character = {
        ...data,
        id: doc.id,
      };

      if (character.name.toLowerCase().includes(query.toLowerCase())) {
        characters.push(character);
      }
    });

    return characters;
  } catch (e) {
    console.log(e);
  }
};

export const useUpdateDatabaseCharacter = async (
  character?: CharacterInterface
) => {
  try {
    await databaseSet(databaseRef(firebaseDatabase, "character"), {
      ...character,
      src: character?.image || "",
    });
  } catch (e) {
    console.log(e);
  }
};

export const useQuickCreateCharacter = async (
  character: CharacterInterface,
  blob: Blob
) => {
  try {
    const doc = await addDoc(
      collection(firebaseStore, "characters"),
      character
    );

    const imageRes = await useCreateImage(
      "characters/character-images/" + doc.id,
      blob
    );

    if (!imageRes) throw new Error("No image response.");

    const image = await getDownloadURL(imageRes.ref);

    await setDoc(docRef(firebaseStore, "characters", doc.id), {
      ...character,
      image,
    });
  } catch (e) {
    console.log(e);
  }
};
