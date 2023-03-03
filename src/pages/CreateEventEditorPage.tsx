import { Component, createSignal } from "solid-js";
import { useSession } from "../auth";
import { useNavigate } from "@solidjs/router";

import EventEditorComponent from "../components/events/EventEditorComponent";
import { addDoc, collection } from "firebase/firestore";
import { firebaseStore } from "..";
import { Editor } from "@tiptap/core";

import { EventInterface } from "../types/EventType";
import { CalendarClass } from "../classes/CalendarClass";

const CreateEventEditorPage: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  const [event, setEvent] = createSignal<EventInterface>({
    title: "",
    description: "",
    contents: "",
    thumbnail: "",
    date: CalendarClass.START_DATE,
  });
  const [editor, setEditor] = createSignal<Editor>();

  if (session().status === "loading") return <div>Loading</div>;

  if (!session().admin || session().status === "unauthenticated") {
    navigate("/", { replace: true });
    return <div>Not admin</div>;
  }

  const postEvent = async () => {
    try {
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
      navigate(`/events/${res.id}`);
    } catch (e) {
      console.error(e);
    }
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
        <EventEditorComponent
          setEditor={setEditor}
          event={event}
          setEvent={setEvent}
        />
      </div>
    </>
  );
};

export default CreateEventEditorPage;
