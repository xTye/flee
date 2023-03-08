// @ts-nocheck
import { Component } from "solid-js";

const TwitchEmbedComponent: Component<{
  src: string;
  class?: string;
}> = (props) => {
  return (
    <>
      <Show when={import.meta.env.MODE === "production"}>
        <iframe
          src={props.src}
          frameborder="0"
          allowfullscreen="true"
          scrolling="no"
          class={`aspect-video ${props.class}`}
        ></iframe>
      </Show>
    </>
  );
};

export default TwitchEmbedComponent;
