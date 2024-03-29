import { Accessor, Component } from "solid-js";

import DatePickerComponent from "../DatePickerComponent";
import TiptapComponent from "../TiptapComponent";
import { Editor } from "@tiptap/core";
import { EventInterface } from "../../types/EventType";

interface EventEditorProps {
  setEditor: (editor?: Editor) => void;
  editorDefaultContent?: string;
  event: Accessor<EventInterface>;
  setEvent: (event: EventInterface) => void;
}

const EventEditorComponent: Component<EventEditorProps> = (props) => {
  return (
    <>
      <div class="flex flex-col md:flex-row gap-6 md:gap-0">
        {/* Add a relative where the width will break the flexbox */}
        <div class="relative w-full flex flex-col gap-6 md:p-8 overflow-hidden">
          <div class="flex items-center gap-4">
            <div class="flex flex-col justify-center gap-6">
              <div>Title</div>
              <div>Description</div>
            </div>
            <div class="flex flex-col justify-center w-full gap-6">
              <input
                value={props.event().title}
                class="w-full lg:w-2/5 text-black rounded-sm"
                onChange={(e) =>
                  props.setEvent({
                    ...props.event(),
                    title: e.currentTarget.value,
                  })
                }
              />
              <input
                value={props.event().description}
                class="w-full text-black rounded-sm"
                onChange={(e) =>
                  props.setEvent({
                    ...props.event(),
                    description: e.currentTarget.value,
                  })
                }
              />
            </div>
          </div>

          <div class="w-3/5 sm:w-2/5 md:w-1/5">
            <DatePickerComponent
              defaultDate={props.event().date}
              insSelectedDate={props.event().date}
              setDate={(date) => props.setEvent({ ...props.event(), date })}
            />
          </div>

          <div class="relative flex flex-col justify-center gap-2">
            <div>Contents</div>
            <TiptapComponent
              defaultContent={props.editorDefaultContent}
              setEditor={props.setEditor}
            />
          </div>
        </div>
        <div class="flex flex-col gap-4 w-full md:w-2/5">
          <div class="flex items-center gap-8">
            <div>Thumbnail</div>
            <input
              value={props.event().thumbnail}
              class="w-full text-black rounded-sm"
              onChange={(e) =>
                props.setEvent({
                  ...props.event(),
                  thumbnail: e.currentTarget.value,
                })
              }
            />
          </div>
          <img
            class="object-cover aspect-square"
            src={
              props.event().thumbnail === ""
                ? "/character/character-images/instance.PNG"
                : props.event().thumbnail
            }
            alt="Article image"
          />
        </div>
      </div>
    </>
  );
};

export default EventEditorComponent;
