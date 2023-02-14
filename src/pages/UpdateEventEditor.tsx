import { Component, createSignal, onMount, Show } from "solid-js";
import { useSession } from "../auth";
import { useNavigate, useParams } from "@solidjs/router";

import EventEditor from "../components/events/EventEditor";
import { FleeEvent } from "../classes/FleeEvents";
import { FleeCalendar } from "../classes/FleeCalendar";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firebaseStore } from "..";
import { useFetchEvent } from "../hooks/event";

const UpdateEventEditor: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  const params = useParams();

  const [event, setEvent] = createSignal<FleeEvent | undefined>();

  if (session().status === "loading") <div>Loading</div>;

  if (session().status === "unauthenticated") <div>Not logged in</div>;

  if (!session().admin) {
    <div>Not admin</div>;
    navigate("/", { replace: true });
  }

  onMount(() => {
    useFetchEvent(params.id).then((event) => {
      console.log(event);
      event ? setEvent(event) : navigate("/");
    });
  });

  const updateEvent = async () => {
    const insEvent = event();
    if (!insEvent || !insEvent.id) return;

    console.log("Updating event...");
    const res = await updateDoc(doc(firebaseStore, "events", insEvent.id), {
      title: insEvent.title,
      description: insEvent.description,
      contents: insEvent.contents,
      thumbnail: insEvent.thumbnail,
      day: insEvent.date.day,
      month: insEvent.date.month,
      year: insEvent.date.year,
      era: insEvent.date.era,
      updatedAt: new Date(),
    });
    console.log("Updated event", res);
  };

  return (
    <>
      <div class="flex flex-col gap-4 min-h-screen bg-background text-text p-20">
        <div class="flex justify-between items-center">
          <div class="text-4xl">Update Event</div>
          <button
            onClick={() => updateEvent()}
            class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
          >
            Update Event
          </button>
        </div>
        <Show when={event() != undefined}>
          {/* @ts-ignore */}
          <EventEditor event={event} setEvent={setEvent} />
        </Show>
      </div>
    </>
  );
};

export default UpdateEventEditor;
