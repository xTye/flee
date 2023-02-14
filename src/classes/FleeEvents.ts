import { collection, getDocs } from "firebase/firestore";
import { FleeDate, FleeCalendar } from "./FleeCalendar";
import { firebaseStore } from "..";

export interface FleeEvent {
  id?: string;
  title: string;
  description: string;
  contents: string;
  thumbnail: string;
  date: FleeDate;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FleeEventMethods {
  populateEvents(): Promise<void>;
}

export class FleeEvents implements FleeEventMethods {
  public static DEFAULT_EVENT: FleeEvent = {
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

  private events: Map<string, FleeEvent>;
  private eventsDate: Map<string, FleeEvent[]>;

  constructor() {
    this.events = new Map<string, FleeEvent>();
    this.eventsDate = new Map<string, FleeEvent[]>();
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
        FleeCalendar.validDate(date);
        FleeEvents.validEvent(doc.id, this.events);

        const event = {
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          contents: doc.data().contents,
          thumbnail: doc.data().thumbnail,
          date,
        };

        this.events.set(doc.id, event);

        if (!this.eventsDate.has(FleeCalendar.toString(date)))
          this.eventsDate.set(FleeCalendar.toString(date), []);

        this.eventsDate.get(FleeCalendar.toString(date))?.push(event);
      } catch (e: any) {
        console.error(e.message);
      }
    });
  }

  public static validEvent(id: string, events: Map<string, FleeEvent>) {
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

  public getEventFromDate(date: FleeDate) {
    return this.eventsDate.get(FleeCalendar.toString(date)) || [];
  }
}
