import {
  collection,
  doc as docRef,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { firebaseStore } from "..";

export interface Character {
  id: string;
  userId?: string;
  name: string;
  title: string;
  class: string;
  sheet: string;
  sheetType: string;
  home?: string;
  description: string;
  image: string;
  moves: string;
  movesImage: string;
  type: string;
}

export const useFetchCharacter = async (id: string) => {
  try {
    const doc = await getDoc(docRef(firebaseStore, "characters", id));

    const data = doc.data();
    if (!data) throw new Error("No data found for character.");

    const character = {
      id: doc.id,
      userId: data.userId,
      name: data.name,
      title: data.title,
      class: data.class,
      sheet: data.sheet,
      sheetType: data.sheetType,
      home: data.home,
      description: data.description,
      image: data.image,
      moves: data.moves,
      movesImage: data.movesImage,
      type: data.type,
    };

    return character;
  } catch (e: any) {
    console.error(e.message);
  }
};

export const useFetchCharacters = async () => {
  try {
    const docs = await getDocs(collection(firebaseStore, "characters"));

    const characters: Character[] = [];

    docs.forEach((doc) => {
      const data = doc.data();

      const character = {
        id: doc.id,
        userId: data.userId,
        name: data.name,
        title: data.title,
        class: data.class,
        sheet: data.sheet,
        sheetType: data.sheetType,
        home: data.home,
        description: data.description,
        image: data.image,
        moves: data.moves,
        movesImage: data.movesImage,
        type: data.type,
      };

      characters.push(character);
    });

    return characters;
  } catch (e: any) {
    console.error(e.message);
  }
};
