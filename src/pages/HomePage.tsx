import { Component, Show, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { EventInterface } from "../types/EventType";
import { EventClass } from "../classes/EventClass";
import { useFetchEvent } from "../services/EventService";
import TwitchEmbedComponent from "../components/TwitchEmbedComponent";
import LoadingComponent from "../components/utils/LoadingComponent";

const HomePage: Component = () => {
  const [event, setEvent] = createSignal<EventInterface>();

  onMount(() => {
    useFetchEvent().then((event) => (event ? setEvent(event) : null));
  });

  return (
    <>
      <div class="flex flex-col items-center min-h-screen bg-background text-text">
        <TwitchEmbedComponent
          class={"w-3/5"}
          src="https://player.twitch.tv/?channel=jo_finch&parent=fleednd.com"
        />
        <div class="flex justify-center w-full bg-black h-[500px]">
          <Show when={event()}>
            <div class="flex justify-between items-center md:w-4/5">
              <div class="flex flex-col h-full gap-4 p-8">
                <div class="text-6xl">{event()?.title}</div>
                <div class="flex items-center gap-8">
                  <A
                    class="flex items-center justify-center w-60 h-10 bg-yellow text-center rounded-full hover:bg-red"
                    href={`/events/${event()?.id}`}
                  >
                    Read more!
                  </A>
                  <div class="text-lg">{event()?.description}</div>
                </div>
                <div
                  class="text-xl break-words"
                  innerHTML={event()?.contents}
                />
              </div>
              <img
                class="w-40 h-40 md:w-96 md:h-96 aspect-square object-cover"
                src={event()?.thumbnail}
                alt="Article image"
              />
            </div>
          </Show>
          <Show when={!event()}>
            <div class="flex w-full justify-center items-center">
              <LoadingComponent />
            </div>
          </Show>
        </div>
        <div class="flex justify-between items-center md:w-4/5 h-[450px]">
          <img
            class="w-40 h-40 md:w-96 md:h-96 aspect-square object-cover"
            src="/campaign-images/wanderingarmsnobg.png"
            alt="Article image"
          />
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
              Flee is a DnD 5e campaign DMed by Jo Finch, and played by Connar
              Williams, Tyler Riley, Emma Sunderman, and Brennan Ober.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
