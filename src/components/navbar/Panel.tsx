import { Component, JSX } from "solid-js";

const Panel: Component<{
  children?: JSX.Element;
}> = ({ children }) => {
  return (
    <>
      <div class="absolute right-0 flex justify-center items-center z-[2000] w-40 h-60 bg-white">
        <div class=" bg-purple rounded-md shadow-md">{children}</div>
      </div>
    </>
  );
};

export default Panel;
