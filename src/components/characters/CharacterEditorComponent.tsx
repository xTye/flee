import { Accessor, Component } from "solid-js";

import DatePickerComponent from "../DatePickerComponent";
import TiptapComponent from "../TiptapComponent";
import { Editor } from "@tiptap/core";
import { CharacterInterface } from "../../types/CharacterType";

const CharacterEditorComponent: Component<{
  setEditor: (editor?: Editor) => void;
  editorDefaultContent?: string;
  character: Accessor<CharacterInterface>;
  setCharacter: (character: CharacterInterface) => void;
}> = (props) => {
  return (
    <>
      <div class="flex flex-col md:flex-row gap-6 md:gap-0">
        {/* Add a relative where the width will break the flexbox */}
        <div class="relative w-full flex flex-col gap-6 md:p-8 overflow-hidden">
          <div class="flex items-center gap-4">
            <div class="flex flex-col gap-6 w-24">
              <div>Name</div>
              <div>User Id</div>
              <div>Title</div>
              <div>Class</div>
              <div>Sheet</div>
              <div>Sheet Type</div>
              <div>Home</div>
              <div>Moves</div>
            </div>
            <div class="flex flex-col gap-6 w-full">
              <input
                value={props.character().name}
                class="w-full lg:w-2/5 text-black rounded-sm"
                onChange={(e) =>
                  props.setCharacter({
                    ...props.character(),
                    name: e.currentTarget.value,
                  })
                }
              />
              <input
                value={props.character().userId}
                class="w-full lg:w-2/5 text-black rounded-sm"
                onChange={(e) =>
                  props.setCharacter({
                    ...props.character(),
                    userId: e.currentTarget.value,
                  })
                }
              />
              <input
                value={props.character().title}
                class="w-full text-black rounded-sm"
                onChange={(e) =>
                  props.setCharacter({
                    ...props.character(),
                    title: e.currentTarget.value,
                  })
                }
              />
              <input
                value={props.character().class}
                class="w-full text-black rounded-sm"
                onChange={(e) =>
                  props.setCharacter({
                    ...props.character(),
                    class: e.currentTarget.value,
                  })
                }
              />
              <input
                value={props.character().sheet}
                class="w-full text-black rounded-sm"
                onChange={(e) =>
                  props.setCharacter({
                    ...props.character(),
                    sheet: e.currentTarget.value,
                  })
                }
              />
              <input
                value={props.character().sheetType}
                class="w-full text-black rounded-sm"
                onChange={(e) =>
                  props.setCharacter({
                    ...props.character(),
                    sheetType: e.currentTarget.value,
                  })
                }
              />
              <input
                value={props.character().home}
                class="w-full text-black rounded-sm"
                onChange={(e) =>
                  props.setCharacter({
                    ...props.character(),
                    home: e.currentTarget.value,
                  })
                }
              />
              <input
                value={props.character().moves}
                class="w-full text-black rounded-sm"
                onChange={(e) =>
                  props.setCharacter({
                    ...props.character(),
                    moves: e.currentTarget.value,
                  })
                }
              />
            </div>
          </div>

          <div class="relative flex flex-col justify-center gap-2">
            <div>Description</div>
            <TiptapComponent
              defaultContent={props.editorDefaultContent}
              setEditor={props.setEditor}
            />
          </div>
        </div>
        <div class="flex flex-col gap-4 w-full md:w-2/5">
          <div class="flex items-center gap-4">
            <input
              type="checkbox"
              checked={props.character().hidden}
              class="w-4 h-4"
              onInput={() => {
                props.setCharacter({
                  ...props.character(),
                  hidden: !props.character().hidden,
                });
              }}
            />
            <div>Hidden</div>
          </div>

          <div class="flex items-center gap-8">
            <div>Image</div>
            <input
              value={props.character().image}
              class="w-full text-black rounded-sm"
              onChange={(e) =>
                props.setCharacter({
                  ...props.character(),
                  image: e.currentTarget.value,
                })
              }
            />
          </div>
          <img
            class="object-cover aspect-square"
            src={
              props.character().image === ""
                ? "/characters/character-images/instance.png"
                : props.character().image
            }
            alt="Article image"
          />
          <div class="flex items-center gap-6">
            <div>Moves Image</div>
            <input
              value={props.character().movesImage}
              class="w-full text-black rounded-sm"
              onChange={(e) =>
                props.setCharacter({
                  ...props.character(),
                  movesImage: e.currentTarget.value,
                })
              }
            />
          </div>
          <img
            class="object-cover aspect-square"
            src={
              props.character().movesImage === ""
                ? "/characters/character-images/instance.png"
                : props.character().movesImage
            }
            alt="Article image"
          />
        </div>
      </div>
    </>
  );
};

export default CharacterEditorComponent;
