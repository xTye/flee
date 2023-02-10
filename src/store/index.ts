import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
//import createAgent from "./createAgent";

const StoreContext = createContext();

// export function Provider(props) {
//   const [state, setState] = createStore({
//       get articles() {
//         return articles();
//       },
//       page: 0,
//       totalPagesCount: 0,
//       token: localStorage.getItem("jwt"),
//       appName: "conduit",
//     }),
//     actions = {},
//     store = [state, actions],
//     agent = createAgent(store);

//   articles = createArticles(agent, actions, state, setState);

//   return (
//     <RouterContext.Provider value={router}>
//       <StoreContext.Provider value={store}>
//         {props.children}
//       </StoreContext.Provider>
//     </RouterContext.Provider>
//   );
// }

// export const useStore = () => {
//   return useContext(StoreContext);
// };
