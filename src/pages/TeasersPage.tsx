import { Component, For, Show, createSignal, onMount } from "solid-js";

import { useFetchTeasers } from "../services/TeaserService";
import { TeaserInterface } from "../types/TeaserType";
import LoadingComponent from "../components/utils/LoadingComponent";
import { useSession } from "../auth";
import { A } from "@solidjs/router";

const TeasersPage: Component = () => {
  const [session, actions] = useSession();
  const [teasers, setTeasers] = createSignal<TeaserInterface[]>();

  onMount(async () => {
    const teasers = await useFetchTeasers();
    teasers ? setTeasers(teasers) : null;
  });

  return (
    <>
      <div class="flex flex-col items-center gap-6 min-h-screen bg-background text-text md:text-justify pt-10">
        <div class="flex items-center justify-between w-9/10">
          <div class="text-5xl md:text-7xl">Teasers</div>
          <Show when={session().admin}>
            <A
              href="/teaser-editor"
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Create Teaser
            </A>
          </Show>
        </div>

        <Show when={teasers()} fallback={<LoadingComponent />}>
          <div class="w-9/10 p-2 border-2 border-white rounded-lg">
            <div class="flex flex-col">
              <div class="flex font-bold pb-2 text-yellow text-lg">
                <div class="basis-1/5">ID</div>
                <div>Contents</div>
              </div>
              <For each={teasers()}>
                {(teaser) => (
                  <A
                    href={`/teaser-editor/${teaser.id}`}
                    class="flex py-2 border-t-2 hover:bg-lightPurple overflow-hidden h-16"
                  >
                    <div class="basis-1/5">{teaser.id}</div>
                    <div class="basis-4/5" innerText={teaser.content}></div>
                  </A>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </>
  );
};

export default TeasersPage;
