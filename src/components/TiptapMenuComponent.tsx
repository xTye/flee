import { Editor } from "@tiptap/core";
import { Component } from "solid-js";
import { createEditorTransaction } from "solid-tiptap";

interface TiptapMenuProps {
  editor?: Editor;
}

const TiptapMenuComponent: Component<TiptapMenuProps> = (props) => {
  return (
    <>
      <div class="flex justify-left w-full 2xl:justify-between h-12 px-2 bg-white border-x-2 border-t-2 border-black rounded-t-md overflow-y-hidden overflow-x-auto">
        <div class="flex shrink-0 items-center">
          <img
            src={`/tiptap-menu/bold.svg`}
            alt="bold"
            title="Bold"
            onClick={() => {
              props.editor?.commands.toggleBold();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("bold")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/italic.svg`}
            alt="italic"
            title="Italic"
            onClick={() => {
              props.editor?.commands.toggleItalic();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("italic")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/underline.svg`}
            alt="underline"
            title="Underline"
            onClick={() => {
              props.editor?.commands.toggleUnderline();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("underline")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/strikethrough.svg`}
            alt="strikethrough"
            title="Strike"
            onClick={() => {
              props.editor?.commands.toggleStrike();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("strike")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/subscript.svg`}
            alt="subscript"
            title="Subscript"
            onClick={() => {
              props.editor?.commands.toggleSubscript();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("subscript")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/superscript.svg`}
            alt="superscript"
            title="Superscript"
            onClick={() => {
              props.editor?.commands.toggleSuperscript();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("superscript")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/mark-pen-line.svg`}
            alt="mark-pen-line"
            title="Highlight"
            onClick={() => {
              props.editor?.commands.toggleHighlight({ color: "#f1e740" });
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("highlight")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <div class="border-x h-3/5 border-lightWhite mx-2" />
          <img
            src={`/tiptap-menu/h-1.svg`}
            alt="heading-1"
            title="Heading 1"
            onClick={() => {
              props.editor?.commands.setHeading({ level: 1 });
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("bulletList")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/h-2.svg`}
            alt="heading-2"
            title="Heading 2"
            onClick={() => {
              props.editor?.commands.setHeading({ level: 2 });
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("blockquote")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/h-3.svg`}
            alt="heading-3"
            title="Heading 3"
            onClick={() => {
              props.editor?.commands.setHeading({ level: 3 });
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("heading", { level: 3 })
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/paragraph.svg`}
            alt="paragraph"
            title="Paragraph"
            onClick={() => {
              props.editor?.commands.setParagraph();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("paragraph")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <div class="border-x h-3/5 border-lightWhite mx-2" />
          <img
            src={`/tiptap-menu/align-left.svg`}
            alt="align left"
            title="Left align"
            onClick={() => {
              props.editor?.commands.setTextAlign("left");
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive({ textAlign: "left" })
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/align-center.svg`}
            alt="align center"
            title="Center align"
            onClick={() => {
              props.editor?.commands.setTextAlign("center");
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive({ textAlign: "center" })
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/align-right.svg`}
            alt="align right"
            title="Right align"
            onClick={() => {
              props.editor?.commands.setTextAlign("right");
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive({ textAlign: "right" })
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/align-justify.svg`}
            alt="align justify"
            title="Justify"
            onClick={() => {
              props.editor?.commands.setTextAlign("justify");
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive({ textAlign: "justify" })
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/code-box-line.svg`}
            alt="code block"
            title="Code"
            onClick={() => {
              props.editor?.commands.toggleCode();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("code")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <div class="border-x h-3/5 border-lightWhite mx-2" />
          <img
            src={`/tiptap-menu/list-unordered.svg`}
            alt="list-unordered"
            title="Bullet List"
            onClick={() => {
              props.editor?.commands.toggleBulletList();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("bulletList")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/double-quotes-l.svg`}
            alt="double-quotes"
            title="Blockquote"
            onClick={() => {
              props.editor?.commands.toggleBlockquote();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("blockquote")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
          <img
            src={`/tiptap-menu/separator.svg`}
            alt="Horizontal Ruler"
            title="Horizontal Ruler"
            onClick={() => {
              props.editor?.commands.setHorizontalRule();
              props.editor?.commands.focus();
            }}
            class={`${
              createEditorTransaction(
                () => props.editor, // Editor instance from createTiptapEditor
                (editor) => editor?.isActive("horizontalRule")
              )()
                ? "bg-red"
                : ""
            } w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out`}
          />
        </div>

        <div class="flex shrink-0 items-center">
          <div class="border-x h-3/5 border-lightWhite mx-2" />
          <img
            src={`/tiptap-menu/format-clear.svg`}
            alt="format-clear"
            title="Clear Format"
            onClick={() => {
              props.editor?.commands.clearNodes();
              props.editor?.commands.unsetAllMarks();
              props.editor?.commands.focus();
            }}
            class="w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out"
          />
          <img
            src={`/tiptap-menu/arrow-go-back-line.svg`}
            alt="arrow-go-backwards"
            title="Undo"
            onClick={() => {
              props.editor?.commands.undo();
              props.editor?.commands.focus();
            }}
            class="w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out"
          />
          <img
            src={`/tiptap-menu/arrow-go-forward-line.svg`}
            alt="arrow-go-forward"
            title="Redo"
            onClick={() => {
              props.editor?.commands.redo();
              props.editor?.commands.focus();
            }}
            class="w-7 h-7 p-1 hover:bg-yellow rounded transition ease-in-out"
          />
        </div>
      </div>
    </>
  );
};

export default TiptapMenuComponent;
