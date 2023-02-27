import { Component, createSignal, onMount } from "solid-js";
import { useFetchEvent } from "../hooks/event";
import { A } from "@solidjs/router";
import { FleeEvents, FleeEvent } from "../classes/FleeEvents";

const Home: Component = () => {
  const [event, setEvent] = createSignal<FleeEvent>(FleeEvents.DEFAULT_EVENT);

  onMount(() => {
    useFetchEvent().then((event) => (event ? setEvent(event) : null));
  });

  return (
    <>
      <div class="flex flex-col gap-6 min-h-screen bg-background text-text pt-20">
        <div class="flex justify-between gap-4 p-8 border-b-2 h-96 w-full">
          <div class="flex flex-col gap-4 overflow-hidden">
            <div class="text-7xl w-3/5">{event()?.title}</div>
            <div class="flex items-center gap-8">
              <A
                class="flex items-center justify-center w-60 h-10 bg-yellow text-center rounded-full hover:bg-red"
                href={`/events/${event()?.id}`}
              >
                Read more!
              </A>
              <div class="text-xl">{event()?.description}</div>
            </div>
            <div
              class="h-64 text-xl break-words"
              innerHTML={event()?.contents}
            />
          </div>
          <img
            class="w-1/5 aspect-square object-cover"
            src={event()?.thumbnail}
            alt="Article image"
          />
        </div>
        <div class="flex justify-between border-b-2">
          <div class="flex flex-col gap-4 p-8">
            <div class="text-7xl">Flee</div>
            <div class="flex items-center gap-8">
              <div class="text-xl">
                Situated on the tri-border of the Zushal, Orandi, and Cyroquil
                Kingdoms, Dagger Falls was thought to be diplomatically immune
                to the affairs of the surrounding kingdoms. Now, the Divine
                Council, on a fiend-cleansing crusade, has invaded the small
                village, forcing our adventurers… to Flee.
              </div>
            </div>
            <div class="text-xl">
              Flee is a DnD 5e campaign DMed by Jo Evangelista, and played by
              Connar Williams, Tyler Riley, Emma Sunderman, and Brennan Ober.
            </div>
          </div>
          <img
            src="/campaign-images/wanderingarmsnobg.png"
            alt="Article image"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
