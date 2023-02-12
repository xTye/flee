import { Component, JSX } from "solid-js";

const Panel: Component<{
  children?: JSX.Element;
}> = ({ children }) => {
  return (
    <>
      <div class="absolute right-0 flex justify-center items-center z-[2000] w-32 h-32 bg-white bg-opacity-75">
        <div class="h-3/5 w-3/5 bg-purple rounded-md shadow-md">{children}</div>
      </div>
    </>
  );
};

export default Panel;
