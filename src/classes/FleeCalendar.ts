import { FleeEvent, FleeEventMethods, FleeEvents } from "./FleeEvents";

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

export interface FleeDate {
  day: number;
  month: number;
  year: number;
  era: number;
  events?: FleeEvent[];
}

export interface FleeDateDisplay extends FleeDate {
  holiday?: string;
}

export class FleeCalendar implements FleeEventMethods {
  public static YEARS_PER_ERA = 300;
  public static MONTHS_PER_YEAR = 10;
  public static DAYS_PER_MONTH = 30;

  public static START_DATE = {
    day: 1,
    month: 1,
    year: 1,
    era: 1,
  };

  public static CURRENT_DATE = {
    day: 11,
    month: 2,
    year: 1,
    era: 8,
  };

  private selectedDate = FleeCalendar.CURRENT_DATE;

  private events: FleeEvents;

  constructor() {
    this.events = new FleeEvents();
  }

  public async populateEvents() {
    await this.events.populateEvents();
  }

  public static validDate(date: FleeDate, strict = true) {
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

  public static toString(date: FleeDate) {
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

      FleeCalendar.validDate(date);

      return date;
    } catch (e: any) {
      console.error(e.message);
    }

    return null;
  }

  public getEvent(date: FleeDate) {
    return this.events.getEventFromDate(date);
  }

  // TODO: Query events from the database / events array
  public queryEvents() {}

  public getDates(): FleeDateDisplay[] {
    let dates = [];
    const holidayObj = Object.create(holidays);

    for (let i = 0; i < 30; i++) {
      const date = {
        day: i + 1,
        month: this.selectedDate.month,
        year: this.selectedDate.year,
        era: this.selectedDate.era,
        holiday: holidayObj[`${this.selectedDate.month}-${i + 1}`],
        events: [] as FleeEvent[],
      };

      date.events = this.events.getEventFromDate(date);

      dates.push(date);
    }

    return dates;
  }

  public setSelectedDate(date: FleeDate) {
    FleeCalendar.validDate(date);

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

  public isCurrentDate(date: FleeDate) {
    return (
      date.day === FleeCalendar.CURRENT_DATE.day &&
      date.month === FleeCalendar.CURRENT_DATE.month &&
      date.year === FleeCalendar.CURRENT_DATE.year &&
      date.era === FleeCalendar.CURRENT_DATE.era
    );
  }

  public static formatDate(date: FleeDate | undefined) {
    if (!date) return "";

    try {
      FleeCalendar.validDate(date);

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
