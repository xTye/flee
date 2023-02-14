import { Component, Show, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { useFetchEvent } from "../hooks/event";
import { FleeCalendar } from "../classes/FleeCalendar";
import { A } from "@solidjs/router";
import { useSession } from "../auth";

const Event: Component = () => {
  const [session, actions] = useSession();
  const params = useParams();

  const [event] = createResource(() => params.id, useFetchEvent);

  return (
    <>
      <div class="flex flex-col gap-4 min-h-screen bg-background text-text p-20">
        <div class="flex justify-between items-center">
          <div class="text-7xl w-3/5">{event()?.title}</div>
          <div class="flex gap-4">
            <A
              href="/events"
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              See all news
            </A>
            <Show when={session().admin}>
              <A
                href={`/event-editor/${event()?.id}`}
                class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
              >
                Edit event
              </A>
            </Show>
          </div>
        </div>
        <div class="flex justify-between">
          <div class="relative flex flex-col gap-4 p-8 w-full overflow-hidden">
            <div class="text-sm">{FleeCalendar.formatDate(event()?.date)}</div>
            <div class="flex items-center gap-8">
              <div class="text-sm text-justify">{event()?.description}</div>
            </div>
            <div
              class="text-xl text-justify break-words"
              innerHTML={event()?.contents}
            />
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
