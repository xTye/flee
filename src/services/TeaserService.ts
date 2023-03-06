import { collection, doc as docRef, getDoc, getDocs } from "firebase/firestore";
import { firebaseStore } from "..";
import { CharacterInterface } from "../types/CharacterType";

export const useFetchCharacter = async (id: string) => {
  try {
    const doc = await getDoc(docRef(firebaseStore, "teasers", id));

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

export const useFetchCharacters = async () => {
  try {
    const docs = await getDocs(collection(firebaseStore, "teasers"));

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
