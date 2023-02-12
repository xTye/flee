import { onCleanup } from "solid-js";

export const clickOutside = (el: any, accessor: any) => {
  const onClick = (e: any) => {
    !el.contains(e.target) && accessor();
    console.log(el);
  };
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
};
