import { Component, createResource, createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { useFetchEvent } from "../hooks/fetchEvent";
import { FleeCalendar } from "../classes/FleeCalendar";
import { A } from "@solidjs/router";

const Event: Component = () => {
  const params = useParams();

  const [event] = createResource(() => params.id, useFetchEvent);

  return (
    <>
      <div class="flex flex-col gap-4 min-h-screen bg-background text-text p-20">
        <div class="flex justify-between items-center">
          <div class="text-7xl">{event()?.name}</div>
          <A
            href="/events"
            class="flex items-center justify-center w-96 h-10 bg-yellow rounded-full hover:bg-red"
          >
            See all news
          </A>
        </div>
        <div class="flex justify-between">
          <div class="flex flex-col gap-4 p-8 w-full">
            <div class="text-sm">{FleeCalendar.formatDate(event()?.date)}</div>
            <div class="flex items-center gap-8">
              <div class="text-sm text-justify">{event()?.description}</div>
            </div>
            <div class="text-xl text-justify">{event()?.html}</div>
          </div>
          <img
            class="object-cover aspect-square h-96 w-96 float-right"
            src={event()?.thumbnail}
            alt="Article image"
          />
        </div>
      </div>
    </>
  );
};

export default Event;
