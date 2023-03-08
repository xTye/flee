import { Setter, onCleanup } from "solid-js";

export const pasteFile = (fileRef: HTMLInputElement, setFile: Setter<File>) => {
  const onPaste = async (e: any) => {
    if (e.clipboardData.files.length === 0) return;
    setFile(e.clipboardData.files[0]);
  };
  document.body.addEventListener("paste", onPaste);

  onCleanup(() => document.body.removeEventListener("paste", onPaste));
};
