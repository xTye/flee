import { Component, createMemo } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { navbarHeight } from "./navbar/NavbarComponent";

const ModalComponent: Component<{
  children?: JSX.Element;
  ignoreContents?: boolean;
  css?: string;
  setModal: (modal: boolean) => void;
}> = (props) => {
  let contentsDiv = document.createElement("div") as HTMLDivElement;
  let parentDiv = document.createElement("div") as HTMLDivElement;

  createMemo(() => {
    parentDiv.style.height = window.innerHeight - navbarHeight.height + "px";
  });

  return (
    <>
      <div
        ref={parentDiv}
        style={{
          height: window.innerHeight - navbarHeight.height + "px",
          top: navbarHeight.height + "px",
        }}
        class="fixed top-0 left-0 flex justify-center items-center z-[2000] w-screen bg-white bg-opacity-75"
        onClick={(e) => {
          if (
            !props.ignoreContents &&
            (e.target == contentsDiv || !e.target.contains(contentsDiv))
          )
            return;
          props.setModal(false);
        }}
      >
        <div
          ref={contentsDiv}
          class={`flex items-center justify-center ${
            props.css || "bg-purple"
          } rounded-md shadow-md`}
        >
          {props.children}
        </div>
      </div>
    </>
  );
};

export default ModalComponent;
