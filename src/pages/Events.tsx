import { Component, onMount, createSignal, For, Show } from "solid-js";
import { FleeCalendar } from "../classes/FleeCalendar";
import { FleeEvent, FleeEvents } from "../classes/FleeEvents";
import { A } from "@solidjs/router";
import { useSession } from "../auth";

const Events: Component = () => {
  const [session, actions] = useSession();

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
        <div class="flex justify-between items-center px-40 py-12">
          <div class="text-text text-4xl">News</div>
          <A
            href="/event-editor"
            class="flex items-center justify-center w-48 h-10 bg-yellow rounded-full hover:bg-red text-text"
          >
            New Event
          </A>
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
