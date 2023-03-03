import { Component } from "solid-js";
import "./LoadingComponent.css";

const LoadingComponent: Component = () => {
  return (
    <>
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default LoadingComponent;
