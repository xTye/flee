import { Component, onMount, createSignal, For, Show } from "solid-js";
import { FleeCalendar } from "../classes/FleeCalendar";
import { FleeEvent, FleeEvents } from "../classes/FleeEvents";
import { A } from "@solidjs/router";
import { useSession } from "../auth";
import { useFetchEvents } from "../hooks/event";

const Events: Component = () => {
  const [session, actions] = useSession();

  const [events, setEvents] = createSignal<FleeEvent[]>([]);

  onMount(() => {
    useFetchEvents().then((events) => (events ? setEvents(events) : null));
  });

  return (
    <>
      <div class="flex flex-col min-h-screen bg-blue pb-12">
        <div class="flex justify-between items-center px-40 py-12">
          <div class="text-text text-4xl">News</div>
          <Show when={session().admin}>
            <A
              href="/event-editor"
              class="flex items-center justify-center w-48 h-10 bg-yellow rounded-full hover:bg-red text-text"
            >
              New Event
            </A>
          </Show>
        </div>

        <div class="grid grid-cols-3 gap-4 px-32">
          <For each={events()}>
            {(event) => (
              <>
                <A href={`/events/${event.id}`}>
                  <div
                    class={
                      "flex flex-col bg-white transition-all hover:scale-105 h-72"
                    }
                  >
                    <img
                      class="object-cover w-full h-32"
                      src={event.thumbnail}
                    />
                    <div class="text-black font-bold h-full text-4xl">
                      {event.title}
                    </div>
                  </div>
                </A>
              </>
            )}
          </For>
        </div>
      </div>
    </>
  );
};

export default Events;
