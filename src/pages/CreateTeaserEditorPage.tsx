import { Component, createSignal } from "solid-js";
import { useSession } from "../auth";
import { useNavigate } from "@solidjs/router";

import CharacterEditorComponent from "../components/characters/CharacterEditorComponent";
import { addDoc, collection } from "firebase/firestore";
import { firebaseStore } from "..";
import { Editor } from "@tiptap/core";

import { CharacterInterface } from "../types/CharacterType";

const CreateCharacterEditorPage: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  const [character, setCharacter] = createSignal<CharacterInterface>({
    id: "",
    userId: "",
    name: "",
    title: "",
    class: "",
    sheet: "",
    sheetType: "",
    home: "",
    description: "",
    image: "",
    moves: "",
    movesImage: "",
    type: "",
  });
  const [editor, setEditor] = createSignal<Editor>();

  if (session().status === "loading") return <div>Loading</div>;

  if (!session().admin || session().status === "unauthenticated") {
    navigate("/", { replace: true });
    return <div>Not admin</div>;
  }

  const postCharacter = async () => {
    try {
      const insCharacter = character();

      console.log("Posting character...");
      const res = await addDoc(collection(firebaseStore, "characters"), {
        userId: insCharacter.userId,
        name: insCharacter.name,
        title: insCharacter.title,
        class: insCharacter.class,
        sheet: insCharacter.sheet,
        sheetType: insCharacter.sheetType,
        home: insCharacter.home,
        description: editor()?.getHTML() || "",
        image: insCharacter.image,
        moves: insCharacter.moves,
        movesImage: insCharacter.movesImage,
        type: insCharacter.type,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("Posted character", res);
      navigate(`/characters/${res.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div class="flex flex-col gap-4 min-h-screen bg-background text-text p-4 sm:p-10 lg:p-20">
        <div class="flex flex-col gap-4 sm:flex-row justify-between items-center">
          <div class="text-4xl">Create Character</div>
          <button
            onClick={() => postCharacter()}
            class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
          >
            Post Character
          </button>
        </div>
        <CharacterEditorComponent
          setEditor={setEditor}
          character={character}
          setCharacter={setCharacter}
        />
      </div>
    </>
  );
};

export default CreateCharacterEditorPage;
