import { Component, children } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

const Modal: Component<{
  children?: JSX.Element;
  setModal: (modal: boolean) => void;
}> = ({ children, setModal }) => {
  let contentsDiv = document.createElement("div") as HTMLDivElement;

  return (
    <>
      <div
        class="absolute top-0 left-0 flex justify-center items-center z-[2000] w-screen h-screen bg-white bg-opacity-75"
        onClick={(e) => {
          if (e.target == contentsDiv || !e.target.contains(contentsDiv))
            return;
          setModal(false);
        }}
      >
        <div
          ref={contentsDiv}
          class="h-3/5 w-3/5 bg-purple rounded-md shadow-md"
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
