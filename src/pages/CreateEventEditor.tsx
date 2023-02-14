import { Component, createSignal } from "solid-js";
import { useSession } from "../auth";
import { useNavigate } from "@solidjs/router";

import EventEditor from "../components/events/EventEditor";
import { FleeEvent } from "../classes/FleeEvents";
import { FleeCalendar } from "../classes/FleeCalendar";
import { addDoc, collection } from "firebase/firestore";
import { firebaseStore } from "..";
import { Editor } from "@tiptap/core";

const CreateEventEditor: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  const [event, setEvent] = createSignal<FleeEvent>({
    title: "",
    description: "",
    contents: "",
    thumbnail: "",
    date: FleeCalendar.CURRENT_DATE,
  });
  const [editor, setEditor] = createSignal<Editor>();

  if (session().status === "loading") return <div>Loading</div>;

  if (!session().admin || session().status === "unauthenticated") {
    navigate("/", { replace: true });
    return <div>Not admin</div>;
  }

  const postEvent = async () => {
    console.log("Posting event...");
    const res = await addDoc(collection(firebaseStore, "events"), {
      title: event().title,
      description: event().description,
      contents: editor()?.getHTML() || "",
      thumbnail: event().thumbnail,
      day: event().date.day,
      month: event().date.month,
      year: event().date.year,
      era: event().date.era,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Posted event", res);
  };

  return (
    <>
      <div class="flex flex-col gap-4 min-h-screen bg-background text-text p-20">
        <div class="flex justify-between items-center">
          <div class="text-4xl">Create Event</div>
          <button
            onClick={() => postEvent()}
            class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
          >
            Post Event
          </button>
        </div>
        <EventEditor setEditor={setEditor} event={event} setEvent={setEvent} />
      </div>
    </>
  );
};

export default CreateEventEditor;