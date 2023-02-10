import { FleeDate, FleeCalendar } from "./FleeCalendar";

export interface FleeEvent {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  html: string;
  date: FleeDate;
}

export interface FleeEventMethods {
  populateEvents(): Promise<void>;
}

export class FleeEvents implements FleeEventMethods {
  private events: Map<string, FleeEvent>;
  private eventsDate: Map<string, FleeEvent[]>;

  constructor() {
    this.events = new Map<string, FleeEvent>();
    this.eventsDate = new Map<string, FleeEvent[]>();
  }

  public async populateEvents() {
    const res = await fetch("/events.json");
    const json = await res.json();

    for (const id in json) {
      try {
        const date = {
          day: json[id].day,
          month: json[id].month,
          year: json[id].year,
          era: json[id].era,
        };

        // Validation checking. Throw errors if invalid.
        FleeCalendar.validDate(date);
        FleeEvents.validEvent(id, this.events);

        const event = {
          id,
          name: json[id].name,
          description: json[id].description,
          thumbnail: json[id].thumbnail,
          html: json[id].html,
          date,
        };

        this.events.set(id, event);

        if (!this.eventsDate.has(FleeCalendar.toString(date)))
          this.eventsDate.set(FleeCalendar.toString(date), []);

        this.eventsDate.get(FleeCalendar.toString(date))?.push(event);
      } catch (e: any) {
        console.error(e.message);
        continue;
      }
    }
  }

  public static validEvent(id: string, events: Map<string, FleeEvent>) {
    if (typeof id !== "string") throw new Error("Event ID must be a string");
    if (events.has(id)) throw new Error("Event duplicate ID");
    return true;
  }

  public static async fetchEvent(id: string) {
    const res = await fetch("/events.json");
    const json = await res.json();

    try {
      const date = {
        day: json[id].day,
        month: json[id].month,
        year: json[id].year,
        era: json[id].era,
      };

      // Validation checking. Throw errors if invalid.
      FleeCalendar.validDate(date);

      const event = {
        name: json[id].name,
        description: json[id].description,
        thumbnail: json[id].thumbnail,
        html: json[id].html,
        date,
      };

      return event;
    } catch (e: any) {
      console.error(e.message);
    }
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
