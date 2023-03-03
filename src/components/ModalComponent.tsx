import { Component, createMemo } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { navbarHeight } from "./navbar/NavbarComponent";

const ModalComponent: Component<{
  children?: JSX.Element;
  setModal: (modal: boolean) => void;
}> = ({ children, setModal }) => {
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
          height: (parentDiv.style.height =
            window.innerHeight - navbarHeight.height + "px"),
        }}
        class="absolute top-0 left-0 flex justify-center items-center z-[2000] w-screen bg-white bg-opacity-75"
        onClick={(e) => {
          if (e.target == contentsDiv || !e.target.contains(contentsDiv))
            return;
          setModal(false);
        }}
      >
        <div
          ref={contentsDiv}
          class="flex items-center justify-center bg-purple rounded-md shadow-md"
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default ModalComponent;
