import { Component } from "solid-js";
import "./loading.css";

const LoadingRingComponent: Component = () => {
  return (
    <div class="flex items-center justify-center w-8 h-8">
      <div class="ld ld-ring ld-spin" />
    </div>
  );
};

export default LoadingRingComponent;
