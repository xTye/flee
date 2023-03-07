import { Component, JSX } from "solid-js";

const MapToolComponent: Component<{
  class1?: string;
  class2?: string;
  children?: JSX.Element;
}> = (props) => {
  return (
    <>
      <div
        class={
          props.class1 ||
          "absolute bottom-0 inset-x-0 md:inset-auto md:top-0 z-[1000]"
        }
      >
        <div
          class={
            props.class2 ||
            "flex flex-col gap-1 w-full md:w-72 h-96 mt-1 md:m-4 p-4 bg-white md:rounded-md overflow-hidden"
          }
        >
          {props.children}
        </div>
      </div>
    </>
  );
};

export default MapToolComponent;
