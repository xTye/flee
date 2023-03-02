import { Accessor, Component, createSignal, For } from "solid-js";
import { generateArray } from "../utils/generateArray";
import { DateInterface } from "../types/DateType";
import { CalendarClass } from "../classes/CalendarClass";

interface DatePickerProps {
  defaultDate: DateInterface;
  insSelectedDate: DateInterface;
  setDate: (date: DateInterface) => void;
}

const DatePickerComponent: Component<DatePickerProps> = (props) => {
  return (
    <>
      <div class="flex h-full w-full">
        <div class="flex flex-col items-start h-full w-32 gap-6">
          <div>Day</div>
          <div>Month</div>
          <div>Year</div>
          <div>Era</div>
        </div>
        <div class="flex flex-col gap-6 h-full w-full text-black">
          <select
            class="rounded-sm"
            onChange={(e) => {
              props.setDate({
                ...props.insSelectedDate,
                day: e.currentTarget.value
                  ? parseInt(e.currentTarget.value)
                  : props.insSelectedDate.day,
              });
            }}
          >
            <For each={generateArray(CalendarClass.DAYS_PER_MONTH)}>
              {(day) => (
                <option selected={day === props.defaultDate.day} value={day}>
                  {day}
                </option>
              )}
            </For>
          </select>

          <select
            class="rounded-sm"
            onChange={(e) => {
              props.setDate({
                ...props.insSelectedDate,
                month: e.currentTarget.value
                  ? parseInt(e.currentTarget.value)
                  : props.insSelectedDate.month,
              });
            }}
          >
            <For each={generateArray(CalendarClass.MONTHS_PER_YEAR)}>
              {(month) => (
                <option
                  selected={month === props.defaultDate.month}
                  value={month}
                >
                  {CalendarClass.getMonthName(month)}
                </option>
              )}
            </For>
          </select>

          <select
            class="rounded-sm"
            onChange={(e) => {
              props.setDate({
                ...props.insSelectedDate,
                year: e.currentTarget.value
                  ? parseInt(e.currentTarget.value)
                  : props.insSelectedDate.year,
              });
            }}
          >
            <For each={generateArray(CalendarClass.YEARS_PER_ERA)}>
              {(year) => (
                <option selected={year === props.defaultDate.year} value={year}>
                  {year}
                </option>
              )}
            </For>
          </select>

          <select
            class="rounded-sm"
            onChange={(e) => {
              props.setDate({
                ...props.insSelectedDate,
                era: e.currentTarget.value
                  ? parseInt(e.currentTarget.value)
                  : props.insSelectedDate.era,
              });
            }}
          >
            <For each={generateArray(CalendarClass.ERA_CAP)}>
              {(era) => (
                <option selected={era === props.defaultDate.era} value={era}>
                  {era}
                </option>
              )}
            </For>
          </select>
        </div>
      </div>
    </>
  );
};

export default DatePickerComponent;
