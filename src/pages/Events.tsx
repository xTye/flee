import { Component, onMount, createSignal, For, Show } from "solid-js";
import { FleeCalendar } from "../classes/FleeCalendar";
import { FleeEvent, FleeEvents } from "../classes/FleeEvents";
import { A } from "@solidjs/router";

const Events: Component = () => {
  const [eventsClass, setEventsClass] = createSignal<FleeEvents>(
    new FleeEvents()
  );
  const [events, setEvents] = createSignal<FleeEvent[]>([]);

  onMount(async () => {
    await eventsClass().populateEvents();

    setEvents(eventsClass().getEvents());
  });

  return (
    <>
      <div class="flex flex-col min-h-screen bg-purple pb-12">
        <div class="text-text text-4xl px-40 py-12">News</div>
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
                    <Show when={event.thumbnail}>
                      <img
                        class="object-cover w-full h-32"
                        src={event.thumbnail}
                      />
                    </Show>
                    <div class="text-black font-bold h-full text-4xl">
                      {event.name}
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
