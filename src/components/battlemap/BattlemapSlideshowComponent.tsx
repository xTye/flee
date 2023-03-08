import { Component, Show, createSignal } from "solid-js";
import MapToolComponent from "../utils/MapToolComponent";
import { firebaseDatabase } from "../..";
import { onValue, ref as databaseRef } from "firebase/database";
import SlideshowMenuComponent from "./SlideshowMenuComponent";
import { useSession } from "../../auth";
import { CharacterInterface } from "../../types/CharacterType";

const BattlemapSlideshowComponent: Component = () => {
  const [session, actions] = useSession();
  const [character, setCharacter] = createSignal<
    CharacterInterface & { src: string }
  >();

  onValue(databaseRef(firebaseDatabase, "character"), (snapshot) => {
    setCharacter(snapshot.val());
  });

  return (
    //! This is potentially dangerous because it overwrite relative positioning
    //! of the parent component. This is a temporary solution. MODAL IS IN HERE.
    <MapToolComponent
      class1="absolute right-0 top-0 z-[1001]"
      class2="flex flex-col p-4 w-72"
    >
      <Show when={session().admin}>
        <SlideshowMenuComponent />
      </Show>
      <Show when={character()?.src !== "" && character()?.name}>
        <img src={character()?.src} class="w-full aspect-square object-cover" />
        <div class="text-lg text-right font-bold">{character()?.name}</div>
      </Show>
    </MapToolComponent>
  );
};

export default BattlemapSlideshowComponent;
