import { Component, For, createSignal, onMount } from "solid-js";

import Character from "../components/CharacterComponent";
import CharacterComponent from "../components/CharacterComponent";
import { useFetchCharacters } from "../services/CharacterService";
import { CharacterInterface } from "../types/CharacterType";

const CharactersPage: Component = () => {
  const [characters, setCharacters] = createSignal<CharacterInterface[]>([]);

  onMount(() => {
    useFetchCharacters().then((characters) => {
      console.log(characters);
      characters ? setCharacters(characters) : null;
    });
  });

  return (
    <>
      <div class="min-h-screen bg-background text-text text-justify pt-10">
        <div class="pl-8 text-7xl">The Wandering Eyes</div>
        <div class="flex justify-between">
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
        </div>
        <div class="pl-8 text-7xl">Former Members</div>
        <div class="flex justify-between">
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
        </div>
      </div>
    </>
  );
};

export default CharactersPage;
