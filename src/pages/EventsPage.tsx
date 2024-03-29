import { Component, onMount, createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useSession } from "../auth";
import { EventInterface } from "../types/EventType";
import { useFetchEvents } from "../services/EventService";
import LoadingComponent from "../components/utils/LoadingComponent";

const EventsPage: Component = () => {
  const [session, actions] = useSession();

  const [events, setEvents] = createSignal<EventInterface[]>();

  onMount(() => {
    useFetchEvents().then((events) => (events ? setEvents(events) : null));
  });

  return (
    <>
      <div class="flex flex-col min-h-screen bg-blue pb-12">
        <div class="flex justify-between items-center md:px-40 px-4 py-12">
          <div class="text-text text-4xl">News</div>
          <Show when={session().admin}>
            <A
              href="/event-editor"
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red text-text"
            >
              New Event
            </A>
          </Show>
        </div>

        <Show when={events()} fallback={<LoadingComponent />}>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:px-32">
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
        </Show>
      </div>
    </>
  );
};

export default EventsPage;
