import {
  Accessor,
  useContext,
  createContext,
  Context,
  Setter,
  JSX,
} from "solid-js";
import { ModalActions } from "./ModalContextProvider";

export type ModalStore = [Accessor<JSX.Element | undefined>, ModalActions];

export const ModalContext = createContext<ModalStore>() as Context<ModalStore>;

export const useModal = () => {
  return useContext(ModalContext);
};
