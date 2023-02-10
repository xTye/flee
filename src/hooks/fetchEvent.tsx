import { FleeEvent, FleeEvents } from "../classes/FleeEvents";

export const useFetchEvent = async (id: string) => {
  return await FleeEvents.fetchEvent(id);
};
