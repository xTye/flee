import { Component, Show, createSignal, onMount } from "solid-js";
import { firebaseDatabase } from "../..";
import { onValue, ref } from "firebase/database";
import YoutubeMenuComponent from "../utils/YoutubeMenuComponent";
import YoutubeEmbedComponent from "../utils/YoutubeEmbedComponent";
import MapToolComponent from "../utils/MapToolComponent";
import { useSession } from "../../auth";

const BattlemapMediaPlayerComponent: Component = () => {
  const [session, actions] = useSession();
  const [music, setMusic] = createSignal<string>();

  onMount(async () => {
    onValue(ref(firebaseDatabase, "music/src"), (snapshot) => {
      setMusic(snapshot.val());
    });
  });

  return (
    <>
      <MapToolComponent
        class1="absolute left-0 bottom-0 z-[1000]"
        class2="flex flex-col w-[550px] p-4"
      >
        <Show when={session().admin}>
          <YoutubeMenuComponent />
        </Show>
        <YoutubeEmbedComponent class="aspect-video" src={music} />
      </MapToolComponent>
    </>
  );
};

export default BattlemapMediaPlayerComponent;
