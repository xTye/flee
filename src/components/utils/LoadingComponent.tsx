import { Component, onMount } from "solid-js";
import "./LoadingComponent.css";

const LoadingComponent: Component<{
  color?: "white" | "black";
}> = (props) => {
  return (
    <>
      <div class="flex h-full justify-center items-center w-full">
        <div id="parent" class="lds-ellipsis">
          <div style={{ background: props.color || "white" }}></div>
          <div style={{ background: props.color || "white" }}></div>
          <div style={{ background: props.color || "white" }}></div>
          <div style={{ background: props.color || "white" }}></div>
        </div>
      </div>
    </>
  );
};

export default LoadingComponent;
