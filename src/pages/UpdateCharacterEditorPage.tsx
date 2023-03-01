import { Component, createSignal, onMount, Show } from "solid-js";
import { useSession } from "../auth";
import { useNavigate, useParams, A } from "@solidjs/router";

import CharacterEditorComponent from "../components/characters/CharacterEditorComponent";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseStore } from "..";
import { Editor } from "@tiptap/core";
import { CharacterInterface } from "../types/CharacterType";
import { useFetchCharacter } from "../services/CharacterService";

const UpdateCharacterEditorPage: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  const params = useParams();

  const [character, setCharacter] = createSignal<CharacterInterface>();
  const [editor, setEditor] = createSignal<Editor>();

  let editorDefaultContent = "";

  if (session().status === "loading") return <div>Loading</div>;

  if (!session().admin || session().status === "unauthenticated") {
    navigate("/", { replace: true });
    return <div>Not admin</div>;
  }

  onMount(async () => {
    const character = await useFetchCharacter(params.id);
    editorDefaultContent = character?.description || "";
    character ? setCharacter(character) : navigate("/");
  });

  const updateCharacter = async () => {
    try {
      const insCharacter = character();
      if (!insCharacter || !insCharacter.id)
        throw new Error("Character is not defined");

      console.log("Updating character...");
      const res = await updateDoc(
        doc(firebaseStore, "characters", insCharacter.id),
        {
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
          updatedAt: new Date(),
        }
      );
      console.log("Updated character", res);
      navigate(`/characters/${insCharacter.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div class="flex flex-col gap-4 min-h-screen bg-background text-text p-20">
        <div class="flex justify-between items-center">
          <div class="text-4xl">Update Character</div>
          <div class="flex gap-4">
            <A
              href={`/characters/${params.id}`}
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Go to Character
            </A>
            <button
              onClick={() => updateCharacter()}
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Update Character
            </button>
          </div>
        </div>
        <Show when={character() != undefined}>
          <CharacterEditorComponent
            setEditor={setEditor}
            editorDefaultContent={editorDefaultContent}
            // @ts-ignore
            character={character}
            setCharacter={setCharacter}
          />
        </Show>
      </div>
    </>
  );
};

export default UpdateCharacterEditorPage;
