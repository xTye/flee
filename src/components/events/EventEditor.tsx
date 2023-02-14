import { Accessor, Component, createSignal } from "solid-js";
import { FleeCalendar, FleeDate } from "../../classes/FleeCalendar";

import DatePicker from "../DatePicker";
import Tiptap from "./Tiptap";
import { FleeEvent } from "../../classes/FleeEvents";

interface EventEditorProps {
  event: Accessor<FleeEvent>;
  setEvent: (event: FleeEvent) => void;
}

const EventEditor: Component<EventEditorProps> = (props) => {
  return (
    <>
      <div class="flex">
        {/* Add a relative where the width will break the flexbox */}
        <div class="relative w-full flex flex-col gap-6 p-8 overflow-hidden">
          <div class="flex items-center gap-4">
            <div class="flex flex-col justify-center gap-6">
              <div>Title</div>
              <div>Description</div>
            </div>
            <div class="flex flex-col justify-center w-full gap-6">
              <input
                value={props.event().title}
                class="w-2/5 text-black rounded-sm"
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

          <div class="w-1/5">
            <DatePicker
              defaultDate={props.event().date}
              date={() => props.event().date}
              setDate={(date) => props.setEvent({ ...props.event(), date })}
            />
          </div>

          <div class="relative flex flex-col justify-center gap-2">
            <div>Contents</div>
            <Tiptap
              defualtContent={props.event().contents}
              onChange={(contents) => {
                props.setEvent({ ...props.event(), contents });
              }}
            />
          </div>
        </div>
        <div class="flex flex-col gap-4 w-2/5">
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
                ? "/instance.PNG"
                : props.event().thumbnail
            }
            alt="Article image"
          />
        </div>
      </div>
    </>
  );
};

export default EventEditor;
