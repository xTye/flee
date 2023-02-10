import { Component, createResource } from "solid-js";
import { useFetchEvent } from "../hooks/fetchEvent";
import { A } from "@solidjs/router";

const Home: Component = () => {
  // TODO: Query for the most recent event
  const id = "1";

  const [event] = createResource(() => id, useFetchEvent);

  return (
    <>
      <div class="flex flex-col gap-6 min-h-screen bg-background text-text pt-20 ">
        <div class="flex justify-between gap-4 p-8 border-b-2">
          <div class="flex flex-col gap-4">
            <div class="text-7xl">{event()?.name}</div>
            <div class="flex items-center gap-8">
              <A
                class="flex items-center justify-center w-96 h-10 bg-yellow rounded-full hover:bg-red"
                href={`/events/${id}`}
              >
                Read more!
              </A>
              <div class="text-xl">{event()?.description}</div>
            </div>
            <div class="text-xl">{event()?.html}</div>
          </div>
          <img
            class="object-cover w-96 h-96"
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
          <img src="/wanderingarmsnobg.png" alt="Article image" />
        </div>
      </div>
    </>
  );
};

export default Home;
