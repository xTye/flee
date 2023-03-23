import { Component, Show, createSignal, onMount } from "solid-js";
import MapToolComponent from "../utils/MapToolComponent";
import { firebaseDatabase } from "../..";
import { onValue, ref as databaseRef } from "firebase/database";
import SlideshowMenuComponent from "./SlideshowMenuComponent";
import { useSession } from "../../auth";
import { CharacterInterface } from "../../types/CharacterType";
import { BattlemapInterface } from "../../types/BattlemapType";

const BattlemapSlideshowComponent: Component<{
  battlemap: BattlemapInterface;
}> = (props) => {
  const [session, actions] = useSession();
  const [character, setCharacter] = createSignal<
    CharacterInterface & { src: string }
  >();

  onValue(databaseRef(firebaseDatabase, "character"), (snapshot) => {
    setCharacter(snapshot.val());
  });

  return (
    <MapToolComponent
      class1="absolute right-0 top-0 z-[1000]"
      class2="flex flex-col p-4 w-72"
    >
      <Show when={session().admin}>
        <SlideshowMenuComponent battlemap={props.battlemap} />
      </Show>
      <Show when={character()?.src !== "" && character()?.name}>
        <img src={character()?.src} class="w-full aspect-square object-cover" />
        <div class="text-lg text-right font-bold">{character()?.name}</div>
      </Show>
    </MapToolComponent>
  );
};

export default BattlemapSlideshowComponent;
