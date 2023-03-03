import { Component, For, Show, createSignal, onMount } from "solid-js";

import Character from "../components/CharacterComponent";
import CharacterComponent from "../components/CharacterComponent";
import { useFetchCharacters } from "../services/CharacterService";
import { CharacterInterface } from "../types/CharacterType";
import LoadingComponent from "../components/utils/LoadingComponent";
import { useSession } from "../auth";
import { A } from "@solidjs/router";

const CharactersPage: Component = () => {
  const [session, actions] = useSession();
  const [characters, setCharacters] = createSignal<CharacterInterface[]>();

  onMount(() => {
    useFetchCharacters().then((characters) => {
      characters ? setCharacters(characters) : null;
    });
  });

  return (
    <>
      <div class="min-h-screen bg-background text-text md:text-justify pt-10">
        <Show when={session().admin}>
          <div class="flex justify-center md:justify-end md:pr-10 pb-10">
            <A
              href="/character-editor"
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Create Character
            </A>
          </div>
        </Show>
        <div class="pl-8 text-5xl md:text-7xl">The Wandering Eyes</div>
        <div class="flex flex-col lg:flex-row justify-between">
          <Show when={characters()} fallback={<LoadingComponent />}>
            <For each={characters()}>
              {(character) =>
                character.type === "active" ? (
                  <>
                    <CharacterComponent
                      id={character.id}
                      image={character.image}
                      name={character.name}
                      class={character.class}
                      title={character.title}
                      description={character.description}
                      mainAttack={character.moves}
                      mainAttackImage={character.movesImage}
                    />
                  </>
                ) : (
                  <></>
                )
              }
            </For>
          </Show>
        </div>
        <div class="pl-8 text-5xl md:text-7xl">Former Members</div>
        <div class="flex flex-col md:flex-row justify-between">
          <Show when={characters()} fallback={<LoadingComponent />}>
            <For each={characters()}>
              {(character) =>
                character.type === "former" ? (
                  <>
                    <Character
                      id={character.id}
                      image={character.image}
                      name={character.name}
                      class={character.class}
                      title={character.title}
                      description={character.description}
                      mainAttack={character.moves}
                      mainAttackImage={character.movesImage}
                    />
                  </>
                ) : (
                  <></>
                )
              }
            </For>
          </Show>
        </div>
      </div>
    </>
  );
};

export default CharactersPage;
