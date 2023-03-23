import { onCleanup } from "solid-js";

export const removeContextMenu = () => {
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };
  document.body.addEventListener("contextmenu", onContextMenu);

  onCleanup(() =>
    document.body.removeEventListener("contextmenu", onContextMenu)
  );
};
