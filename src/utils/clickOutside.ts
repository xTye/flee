import { onCleanup } from "solid-js";

export const clickOutside = (el: any, accessor: any, ignore?: any) => {
  const onClick = (e: any) => {
    !el.contains(e.target) && e.target != ignore && accessor();
  };
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
};
