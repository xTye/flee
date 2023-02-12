import {
  getAuth,
  GoogleAuthProvider,
  getRedirectResult,
  signOut,
  User,
} from "firebase/auth";

const API_ROOT = "https://api.realworld.io/api";

const encode = encodeURIComponent;

export interface AgentType {
  Session: {
    current: () => Promise<{ token: string; user: User } | undefined>;
    login: () => Promise<
      | {
          token: string;
          user: User;
        }
      | undefined
    >;
    logout: () => Promise<void>;
  };
}

export const createAgent = ([state, actions]: [any, any]) => {
  // TODO: Impliment function for the API
  // const send = async (method, url, data, resKey) => {
  //   const headers = {},
  //     opts = { method, headers };
  //   if (data !== undefined) {
  //     headers["Content-Type"] = "application/json";
  //     //opts.body = JSON.stringify(data);
  //   }
  //   if (state.token) headers["Authorization"] = `Token ${state.token}`;
  //   try {
  //     const response = await fetch(API_ROOT + url, opts);
  //     const json = await response.json();
  //     return resKey ? json[resKey] : json;
  //   } catch (err) {
  //     if (err && err.response && err.response.status === 401) {
  //       actions.logout();
  //     }
  //     return err;
  //   }
  // };
  //const Session = {
  // return {
  //   Session,
  // };
};
