import { collection, getDocs } from "firebase/firestore";
import { EventInterface } from "../types/EventType";
import { firebaseStore } from "..";
import { DateInterface } from "../types/DateType";
import { CalendarClass } from "./CalendarClass";

export interface EventClassMethods {
  populateEvents(): Promise<void>;
}

export class EventClass implements EventClassMethods {
  public static DEFAULT_EVENT: EventInterface = {
    id: "",
    title: "",
    description: "",
    contents: "",
    thumbnail: "",
    date: {
      day: 1,
      month: 1,
      year: 1,
      era: 1,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  private events: Map<string, EventInterface>;
  private eventsDate: Map<string, EventInterface[]>;

  constructor() {
    this.events = new Map<string, EventInterface>();
    this.eventsDate = new Map<string, EventInterface[]>();
  }

  public async populateEvents() {
    const docs = await getDocs(collection(firebaseStore, "events"));

    docs.forEach((doc) => {
      try {
        const date = {
          day: doc.data().day,
          month: doc.data().month,
          year: doc.data().year,
          era: doc.data().era,
        };

        // Validation checking. Throw errors if invalid.
        CalendarClass.validDate(date);
        EventClass.validEvent(doc.id, this.events);

        const event = {
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          contents: doc.data().contents,
          thumbnail: doc.data().thumbnail,
          date,
        };

        this.events.set(doc.id, event);

        if (!this.eventsDate.has(CalendarClass.toString(date)))
          this.eventsDate.set(CalendarClass.toString(date), []);

        this.eventsDate.get(CalendarClass.toString(date))?.push(event);
      } catch (e: any) {
        console.error(e.message);
      }
    });
  }

  public static validEvent(id: string, events: Map<string, EventInterface>) {
    if (typeof id !== "string") throw new Error("Event ID must be a string");
    if (events.has(id)) throw new Error("Event duplicate ID");
    return true;
  }

  public getEvents() {
    return [...this.events.values()];
  }

  public getEventFromId(id: string) {
    return this.events.get(id) || [];
  }

  public getEventFromDate(date: DateInterface) {
    return this.eventsDate.get(CalendarClass.toString(date)) || [];
  }
}
