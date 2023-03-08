import {
  Component,
  Show,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { A } from "@solidjs/router";
import { useSession } from "../auth";

import { useFetchCharacter } from "../services/CharacterService";
import { CharacterInterface } from "../types/CharacterType";
import { useAdobe } from "../hooks/AdobeHooks";

const Character: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  const params = useParams();

  const [character, setCharacter] = createSignal<CharacterInterface>();

  onMount(async () => {
    const character = await useFetchCharacter(params.id);
    if (character) setCharacter(character);
    else return navigate("/characters");

    if (character.sheet === "") return;

    if (character.sheetType === "pdf") {
      const arr = character.sheetType.split("/");

      useAdobe(character.sheet, arr[arr.length - 1]);
    } else if (character.sheetType === "embed") {
      const div = document.getElementById("character-sheet");
      const embed = document.createElement("embed");
      embed.src = character.sheet;
      embed.style.height = "100%";

      div?.appendChild(embed);
    }
  });

  return (
    <>
      <div class="flex flex-col gap-4 min-h-screen bg-background text-text p-20">
        <div class="flex justify-between items-center">
          <div class="text-7xl w-3/5">{character()?.name}</div>
          <div class="flex gap-4">
            <A
              href="/characters"
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              See all characters
            </A>
            <Show when={session().admin}>
              <A
                href={`/character-editor/${character()?.id}`}
                class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
              >
                Edit character
              </A>
            </Show>
          </div>
        </div>
        <div class="flex justify-between">
          <div class="relative flex flex-col gap-4 p-3 w-full overflow-hidden">
            <div class="text-base text-red">{character()?.title}</div>
            <div class="flex items-center gap-8">
              <div
                class="text-base text-justify"
                innerHTML={character()?.description}
              />
            </div>
            <div
              class="flex flex-col gap-4 h-[800px] text-xl text-justify break-words"
              id="character-sheet"
            />
          </div>
          <img
            class="object-cover aspect-square h-96 w-96 float-right"
            src={character()?.image}
            alt="Article image"
          />
        </div>
      </div>
    </>
  );
};

export default Character;
