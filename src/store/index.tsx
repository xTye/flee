// import { createContext, useContext, Component, JSX } from "solid-js";
// import { Store, createStore } from "solid-js/store";
// import { SessionActions, SessionState, createSession } from "./createSession";

// type CombinedStore = Store<SessionState & SessionActions>;

// const StoreContext = createContext<Store<CombinedStore>>();

// interface StoreProviderProps {
//   children: JSX.Element;
// }

// export const StoreProvider: Component<StoreProviderProps> = (props) => {
//   const [sessionState, sessionActions] = createSession();

//   const combinedStore: Store<CombinedStore> = {
//     ...sessionState,
//     ...sessionActions,
//   };

//   return (
//     <StoreContext.Provider value={combinedStore}>
//       {props.children}
//     </StoreContext.Provider>
//   );
// };

// export const useStore = () => {
//   return useContext(StoreContext);
// };
