import { createSignal, JSX, Component, Show } from "solid-js";
import { ModalContext } from "./ModalContext";
import ModalComponent from "../ModalComponent";

export interface ModalActions {
  open: (content: JSX.Element) => void;
  close: () => void;
}

export const ModalProvider: Component<{
  children: JSX.Element;
}> = (props) => {
  const [content, setContent] = createSignal<JSX.Element | undefined>();

  const actions = {
    open: (content: JSX.Element) => setContent(content),
    close: () => setContent(undefined),
  };

  return (
    <ModalContext.Provider value={[content, actions]}>
      {props.children}
      <Show when={content()}>
        <ModalComponent setModal={actions.close}>{content()}</ModalComponent>
      </Show>
    </ModalContext.Provider>
  );
};
