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

  private selectedDate = CalendarClass.START_DATE;
  private events: EventClass;

  constructor() {
    this.events = new EventClass();
  }

  public async populateEvents() {
    await this.events.populateEvents();
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

  public getDates(): DateInterface[] {
    let dates: DateInterface[] = [];
    const holidayObj = Object.create(holidays);

    for (let i = 0; i < 30; i++) {
      const date = {
        day: i + 1,
        month: this.selectedDate.month,
        year: this.selectedDate.year,
        era: this.selectedDate.era,
        events: [] as EventInterface[],
        holiday: holidayObj[`${this.selectedDate.month}-${i + 1}`],
      };

      date.events = this.events.getEventFromDate(date);

      dates.push(date);
    }

    return dates;
  }

  public setSelectedDate(date: DateInterface) {
    CalendarClass.validDate(date);

    this.selectedDate = date;
  }

  public get date() {
    return this.selectedDate;
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

  public get day() {
    return this.selectedDate.day;
  }

  public get month() {
    return this.selectedDate.month;
  }

  public get monthName() {
    return monthNames[this.selectedDate.month - 1];
  }

  public get moon() {
    return moonPhases[this.selectedDate.day - 1];
  }

  public get year() {
    return this.selectedDate.year;
  }

  public get era() {
    return this.selectedDate.era;
  }
}
