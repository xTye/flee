import { Accessor, Component, createSignal, For } from "solid-js";
import { generateArray } from "../utils/generateArray";
import { FleeCalendar, FleeDate } from "../classes/FleeCalendar";

interface DatePickerProps {
  defaultDate: FleeDate;
  date: Accessor<FleeDate>;
  setDate: (date: FleeDate) => void;
}

const DatePicker: Component<DatePickerProps> = (props) => {
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
                ...props.date(),
                day: e.currentTarget.value
                  ? parseInt(e.currentTarget.value)
                  : props.date().day,
              });
            }}
          >
            <For each={generateArray(FleeCalendar.DAYS_PER_MONTH)}>
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
                ...props.date(),
                month: e.currentTarget.value
                  ? parseInt(e.currentTarget.value)
                  : props.date().month,
              });
            }}
          >
            <For each={generateArray(FleeCalendar.MONTHS_PER_YEAR)}>
              {(month) => (
                <option
                  selected={month === props.defaultDate.month}
                  value={month}
                >
                  {FleeCalendar.getMonthName(month)}
                </option>
              )}
            </For>
          </select>

          <select
            class="rounded-sm"
            onChange={(e) => {
              props.setDate({
                ...props.date(),
                year: e.currentTarget.value
                  ? parseInt(e.currentTarget.value)
                  : props.date().year,
              });
            }}
          >
            <For each={generateArray(FleeCalendar.YEARS_PER_ERA)}>
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
                ...props.date(),
                era: e.currentTarget.value
                  ? parseInt(e.currentTarget.value)
                  : props.date().era,
              });
            }}
          >
            <For each={generateArray(FleeCalendar.ERA_CAP)}>
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

export default DatePicker;
