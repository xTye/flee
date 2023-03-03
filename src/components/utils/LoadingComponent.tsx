import { Component } from "solid-js";
import "./LoadingComponent.css";

const LoadingComponent: Component = () => {
  return (
    <>
      <div class="flex h-full justify-center items-center w-full">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default LoadingComponent;
