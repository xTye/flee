import { DateInterface } from "../types/DateType";
import { EventInterface } from "../types/EventType";
import { EventClass, EventClassMethods } from "./EventClass";

const moonPhases = [
  "🌑🌑",
  "🌑🌑",
  "🌒🌑",
  "🌒🌑",
  "🌓🌒",
  "🌓🌒",
  "🌔🌒",
  "🌔🌒",
  "🌕🌓",
  "🌕🌓",
  "🌖🌓",
  "🌖🌓",
  "🌗🌔",
  "🌗🌔",
  "🌘🌔",
  "🌑🌕",
  "🌑🌕",
  "🌒🌕",
  "🌒🌕",
  "🌓🌖",
  "🌓🌖",
  "🌔🌖",
  "🌔🌖",
  "🌕🌗",
  "🌕🌗",
  "🌖🌗",
  "🌖🌗",
  "🌗🌘",
  "🌗🌘",
  "🌘🌘",
];
const monthNames = [
  "Kansen",
  "Omsen",
  "Teqsen",
  "Aisen",
  "Chensen",
  "Jwesen",
  "Yvsen",
  "Kyesen",
  "Pyrsen",
  "Ghansen",
];
const holidays = {
  "2-16": "Beginning of Months of Growth; Winter's End Festival",
  "5-1": "Beginning of Months of Rest",
  "6-1": "Prince of Tarning Hold's Naming Day",
  "7-16": "Beginning of Months of Plenty; Harvest Festival",
  "10-1": "Beginning of Months of Dreams",
};

export class CalendarClass implements EventClassMethods {
  public static YEARS_PER_ERA = 300;
  public static MONTHS_PER_YEAR = 10;
  public static DAYS_PER_MONTH = 30;
  public static ERA_CAP = 10;

  public static START_DATE = {
    day: 1,
    month: 1,
    year: 1,
    era: 1,
  };

  private events: EventClass;

  constructor() {
    this.events = new EventClass();
  }

  public async populateEvents() {
    await this.events.populateEvents();
  }

  public getDates(selectedDate: DateInterface): DateInterface[] {
    let dates: DateInterface[] = [];
    const holidayObj = Object.create(holidays);

    for (let i = 0; i < 30; i++) {
      const date = {
        day: i + 1,
        month: selectedDate.month,
        year: selectedDate.year,
        era: selectedDate.era,
        events: [] as EventInterface[],
        holiday: holidayObj[`${selectedDate.month}-${i + 1}`],
      };

      date.events = this.events.getEventFromDate(date);

      dates.push(date);
    }

    return dates;
  }

  public static validDate(date: DateInterface, strict = true) {
    if (
      date.day <= 0 ||
      date.day > 30 ||
      date.month <= 0 ||
      date.month > 10 ||
      date.era <= 0 ||
      date.year <= 0
    ) {
      if (strict) throw new Error("Invalid day");
      else return false;
    }

    return true;
  }

  public static isSameDay(date1: DateInterface, date2: DateInterface) {
    return (
      date1.day === date2.day &&
      date1.month === date2.month &&
      date1.year === date2.year &&
      date1.era === date2.era
    );
  }

  public static toString(date: DateInterface) {
    return `${date.day}-${date.month}-${date.year}-${date.era}`;
  }

  public static toDate(string: string) {
    try {
      const parse = string.split("-");
      const date = {
        day: parseInt(parse[0]),
        month: parseInt(parse[1]),
        year: parseInt(parse[2]),
        era: parseInt(parse[3]),
      };

      CalendarClass.validDate(date);

      return date;
    } catch (e: any) {
      console.error(e.message);
    }

    return null;
  }

  public getEvent(date: DateInterface) {
    return this.events.getEventFromDate(date);
  }

  public static getMoonPhase(day: number) {
    return moonPhases[day - 1];
  }

  public static getMonthName(month: number) {
    return monthNames[month - 1];
  }

  public static formatDate(date: DateInterface | undefined) {
    if (!date) return "";

    try {
      CalendarClass.validDate(date);

      return `${date.day} of ${monthNames[date.month - 1]} in ${
        date.year
      } years of the ${date.era} era`;
    } catch (e: any) {
      console.error(e.message);
    }

    return "";
  }

  public static monthName(date: DateInterface) {
    return monthNames[date.month - 1];
  }

  public static moon(date: DateInterface) {
    return moonPhases[date.day - 1];
  }
}
