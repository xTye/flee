import { Component, onMount } from "solid-js";
import { createTiptapEditor } from "solid-tiptap";
import { Editor } from "@tiptap/core";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";

import TiptapMenuComponent from "./TiptapMenuComponent";

interface TiptapProps {
  setEditor?: (editor?: Editor) => void;
  defaultContent?: string;
}

const TiptapComponent: Component<TiptapProps> = (props) => {
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
    content: props.defaultContent || "",
    editorProps: {
      attributes: {
        class:
          "h-64 focus:outline-none bg-white text-black border-2 border-black p-2 rounded-b-md overflow-auto",
      },
    },
    onUpdate: ({ editor }) => {
      localStorage.setItem("content", editor.getHTML());
    },
  }));

  onMount(() => {
    if (props.setEditor) props.setEditor(editor());
  });

  return (
    <>
      <div>
        <TiptapMenuComponent editor={editor()} />
        <div id="editor" ref={ref} />
      </div>
    </>
  );
};

export default TiptapComponent;
