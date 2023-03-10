import {
  Component,
  For,
  Show,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import { A } from "@solidjs/router";
import { EventInterface } from "../types/EventType";
import { useFetchEvent } from "../services/EventService";
import LoadingComponent from "../components/utils/LoadingComponent";

import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
import { useFetchTeasers } from "../services/TeaserService";
import { TeaserInterface } from "../types/TeaserType";

const HomePage: Component = () => {
  const [event, setEvent] = createSignal<EventInterface>();
  const [teasers, setTeasers] = createSignal<TeaserInterface[]>();

  let splideRef = document.createElement("div") as HTMLDivElement;

  createEffect(() => {
    if (!teasers()) return;
    const splide = new Splide(splideRef, {
      type: "loop",
      autoplay: true,
      pauseOnHover: true,
    });

    splide.mount();
  }, [teasers()]);

  onMount(async () => {
    const event = await useFetchEvent();
    setEvent(event);
    const teasers = await useFetchTeasers({ limit: 5 });
    setTeasers(teasers);
  });

  return (
    <>
      <div class="flex flex-col items-center md:gap-6 min-h-screen bg-background text-text">
        <Show
          when={event() && teasers()}
          fallback={
            <div class="flex w-full justify-center items-center">
              <LoadingComponent />
            </div>
          }
        >
          <section
            ref={splideRef}
            class="splide w-full md:w-4/5 lg:w-3/5 h-[500px]"
            aria-label="Splide Basic HTML Example"
          >
            <div class="splide__track h-full">
              <ul class="splide__list h-full">
                <For each={teasers()}>
                  {(teaser, i) => (
                    <>
                      <li class="splide__slide">
                        <div
                          class="flex flex-col items-center justify-center w-full h-full p-20 text-justify overflow-y-auto"
                          innerText={teaser.content}
                        ></div>
                      </li>
                    </>
                  )}
                </For>
              </ul>
            </div>
            <div class="splide__progress">
              <div class="splide__progress__bar"></div>
            </div>
          </section>
          <div class="flex justify-center w-full bg-black lg:h-[500px]">
            <div class="flex flex-col md:flex-row justify-between items-center md:w-4/5">
              <div class="flex flex-col h-full gap-4 p-8">
                <div class="text-6xl">{event()?.title}</div>
                <div class="flex flex-col xl:flex-row items-center gap-8">
                  <A
                    class="flex items-center justify-center w-40 px-6 py-2 bg-yellow text-center rounded-full hover:bg-red"
                    href={`/events/${event()?.id}`}
                  >
                    Read more!
                  </A>
                  <div class="text-lg">{event()?.description}</div>
                </div>
              </div>
              <img
                class="w-full md:w-40 lg:w-96 aspect-square object-cover"
                src={event()?.thumbnail}
                alt="Article image"
              />
            </div>
          </div>
        </Show>

        <div class="flex flex-col-reverse md:flex-row justify-between items-center md:w-4/5 lg:h-[450px]">
          <img
            class="w-full md:w-40 lg:w-96 aspect-square object-cover"
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
