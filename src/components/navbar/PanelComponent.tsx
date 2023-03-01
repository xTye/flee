import { Component, JSX } from "solid-js";

const PanelComponent: Component<{
  children?: JSX.Element;
}> = ({ children }) => {
  return (
    <>
      <div class="absolute right-0 flex justify-center items-center z-[2000]">
        {children}
      </div>
    </>
  );
};

export default PanelComponent;
