import { collection, doc as docRef, getDoc, getDocs } from "firebase/firestore";
import { firebaseStore } from "..";
import { CharacterInterface } from "../types/CharacterType";

export const useFetchCharacter = async (id: string) => {
  try {
    const doc = await getDoc(docRef(firebaseStore, "characters", id));

    const data = doc.data();
    if (!data) throw new Error("No data found for character.");

    const character: CharacterInterface = {
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

    const characters: CharacterInterface[] = [];

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
