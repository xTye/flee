import { Accessor, Component } from "solid-js";

import { Editor } from "@tiptap/core";
import { TeaserInterface } from "../../types/TeaserType";

const TeaserEditorComponent: Component<{
  setEditor: (editor?: Editor) => void;
  editorDefaultContent?: string;
  teaser: Accessor<TeaserInterface>;
  setTeaser: (character: TeaserInterface) => void;
}> = (props) => {
  return (
    <>
      <div class="flex flex-col md:flex-row gap-6 md:gap-0">
        {/* Add a relative where the width will break the flexbox */}
        <div class="relative w-full flex flex-col gap-6 md:p-8 overflow-hidden">
          <div class="relative flex flex-col justify-center gap-2">
            <div>Content</div>
            <textarea
              class="text-black p-2 h-64 rounded-md focus:outline-none"
              value={props.teaser().content}
              onInput={(e) => {
                props.setTeaser({
                  ...props.teaser(),
                  content: e.currentTarget.value,
                });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TeaserEditorComponent;
