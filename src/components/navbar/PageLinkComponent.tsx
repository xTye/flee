import { A } from "@solidjs/router";
import { Component } from "solid-js";

const PageLinkComponent: Component<{
  onClick?: () => void;
}> = (props) => {
  return (
    <>
      <A href="/characters" class="hover:text-yellow" onClick={props.onClick}>
        Characters
      </A>
      <A href="/map" class="hover:text-yellow" onClick={props.onClick}>
        Map
      </A>
      <A href="/calendar" class="hover:text-yellow" onClick={props.onClick}>
        Calendar
      </A>
      <A href="/events" class="hover:text-yellow" onClick={props.onClick}>
        Events
      </A>
    </>
  );
};

export default PageLinkComponent;
