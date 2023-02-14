import { Component, Show, createEffect, untrack } from "solid-js";
import {
  createEditorTransaction,
  createTiptapEditor,
  useEditorHTML,
} from "solid-tiptap";
import { Editor } from "@tiptap/core";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";

import TiptapMenu from "./TiptapMenu";

interface TiptapProps {
  defualtContent?: string;
  onChange: (content: string) => void;
}

const Tiptap: Component<TiptapProps> = (props) => {
  let ref!: HTMLDivElement;

  const editor = createTiptapEditor(() => ({
    element: ref!,
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign,
      Subscript,
      Superscript,
    ],
    content: props.defualtContent || "",
    editorProps: {
      attributes: {
        class:
          "h-64 focus:outline-none bg-white text-black border-2 border-black p-2 rounded-b-md overflow-auto",
      },
    },
    onUpdate: ({ editor }) => {
      props.onChange(editor.getHTML());
    },
  }));

  return (
    <>
      <div>
        <TiptapMenu editor={editor()} />
        <div id="editor" ref={ref} />
      </div>
    </>
  );
};

export default Tiptap;
