// @ts-nocheck
//! DEPRECATED - USES IFRAMES BUT ONLY WORK ON PRODUCTION
import * as Twitch from "../utils/twitch";

export const useTwitch = () => {
  new Twitch.Player("twitch-embed", {
    channel: "jo_finch",
  });
};
