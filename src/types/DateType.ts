import { EventInterface } from "./EventType";

export interface DateInterface {
  day: number;
  month: number;
  year: number;
  era: number;
  events?: EventInterface[];
  holiday?: string;
}
