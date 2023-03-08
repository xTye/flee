// @ts-nocheck
import { Accessor, Component, onMount } from "solid-js";

const YoutubeEmbedComponent: Component<{
  force?: boolean;
  src: Accessor<string | undefined>;
  class?: string;
}> = (props) => {
  return (
    <>
      <Show when={props.src()} keyed>
        {(src: string) => (
          <Show
            when={props.force || import.meta.env.MODE === "production"}
            fallback={<div class={props.class}>{src}</div>}
          >
            <iframe
              src={src}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              class={props.class}
            ></iframe>
          </Show>
        )}
      </Show>
    </>
  );
};

export default YoutubeEmbedComponent;
