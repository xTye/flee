import { Accessor, useContext, createContext, Context } from "solid-js";
import { SessionActions, SessionState } from "./Session";

export type SessionStore = [Accessor<SessionState>, SessionActions];

export const SessionContext =
  createContext<SessionStore>() as Context<SessionStore>;

export const useSession = () => {
  return useContext(SessionContext);
};
