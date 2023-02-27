import {
  Component,
  onMount,
  createSignal,
  createMemo,
  For,
  Show,
} from "solid-js";
import {
  FleeCalendar,
  FleeDate,
  FleeDateDisplay,
} from "../classes/FleeCalendar";
import { navbarHeight } from "../components/navbar/Navbar";
import { A } from "@solidjs/router";

import Modal from "../components/Modal";
import DatePicker from "../components/DatePicker";

const Calendar: Component = () => {
  let calendarDiv = document.createElement("div") as HTMLDivElement;

  const [calendar, setCalendar] = createSignal<FleeCalendar>(
    new FleeCalendar()
  );
  const [date, setDate] = createSignal<FleeDate>(FleeCalendar.CURRENT_DATE);
  const [dates, setDates] = createSignal<FleeDateDisplay[]>([]);
  const [modal, setModal] = createSignal<boolean>(false);

  const changeDate = (date: FleeDate) => {
    calendar().setSelectedDate(date);

    setDates(calendar().getDates());
    setDate(calendar().date);
  };

  createMemo(() => {
    calendarDiv.style.height = window.innerHeight - navbarHeight.height + "px";
  });

  onMount(async () => {
    await calendar().populateEvents();

    setDates(calendar().getDates());
  });

  return (
    <>
      <div
        ref={calendarDiv}
        style={{
          height: (calendarDiv.style.height =
            window.innerHeight - navbarHeight.height + "px"),
        }}
        class="bg-background p-12"
      >
        <div class="flex flex-col bg-lightPurple h-full rounded-b-md">
          <div class="flex justify-between items-center bg-purple h-20 px-20">
            <div class="text-text">{`Era: ${date().era} | Year: ${
              date().year
            } | Month: ${FleeCalendar.getMonthName(date().month)} `}</div>
            <div class="flex gap-4">
              <div class="flex">
                <button
                  class="flex items-center justify-center bg-white h-10 w-10 rounded-l-full hover:bg-red"
                  onClick={() => {
                    const date = {
                      ...calendar().date,
                      day: 1,
                    };

                    if (date.month - 1 == 0) {
                      date.month = FleeCalendar.MONTHS_PER_YEAR;

                      if (date.year - 1 == 0) {
                        date.year = FleeCalendar.YEARS_PER_ERA;

                        if (date.era - 1 == 0) return;

                        date.era--;
                      } else {
                        date.year--;
                      }
                    } else {
                      date.month--;
                    }

                    changeDate(date);
                  }}
                >
                  <img
                    src="/util-images/arrow.png"
                    alt="Arrow pointing left"
                    class="object-fit h-8 w-8 rotate-180"
                  />
                </button>
                <div class="border-l-2 border-black"></div>
                <button
                  class="flex items-center justify-center bg-white h-10 w-10 rounded-r-full hover:bg-red"
                  onClick={() => {
                    const date = {
                      ...calendar().date,
                      day: 1,
                    };

                    if (date.month % FleeCalendar.MONTHS_PER_YEAR == 0) {
                      date.month = 1;

                      if (date.year % FleeCalendar.YEARS_PER_ERA == 0) {
                        date.year = 1;

                        date.era++;
                      } else {
                        date.year++;
                      }
                    } else {
                      date.month++;
                    }

                    changeDate(date);
                  }}
                >
                  <img
                    src="/util-images/arrow.png"
                    alt="Arrow pointing right"
                    class="object-fit h-8 w-8"
                  />
                </button>
              </div>
              <button
                class="flex items-center justify-center bg-white h-10 w-10 rounded-full hover:bg-red"
                onClick={() => setModal(true)}
              >
                <img
                  src="/util-images/arrow.png"
                  alt="Arrow pointing right"
                  class="object-fit h-8 w-8 rotate-90"
                />
                <Show when={modal()}>
                  <Modal setModal={setModal}>
                    <div class="flex flex-col items-center h-full text-2xl text-white p-5 gap-6">
                      <div class="text-3xl">Enter A Custom Date</div>
                      <DatePicker
                        defaultDate={calendar().date}
                        date={date}
                        setDate={changeDate}
                      />
                      <button
                        class="w-2/5 bg-white rounded-full text-black hover:bg-red"
                        onClick={() => {
                          changeDate(FleeCalendar.CURRENT_DATE);
                          setModal(false);
                        }}
                      >
                        Go to current date
                      </button>
                    </div>
                  </Modal>
                </Show>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-10 grid-rows-3 gap-1 h-full text-sm p-2 select-none overflow-hidden">
            <For each={dates()}>
              {(date) => (
                <div
                  class={`relative flex flex-col bg-${
                    calendar().isCurrentDate(date) ? "yellow" : "white"
                  } h-full rounded-md hover:bg-red p-2 overflow-hidden hover:overflow-y-auto`}
                >
                  <div>{date.day}</div>
                  <div>{FleeCalendar.getMoonPhase(date.day)}</div>
                  <Show when={date.holiday}>
                    <div>{date.holiday}</div>
                  </Show>
                  <Show when={date.events}>
                    <div class="flex flex-col">
                      <For each={date.events}>
                        {(event) => (
                          <A
                            href={`/events/${event.id}`}
                            class="font-bold rounded-md p-1 hover:bg-white truncate"
                          >
                            {event.title}
                          </A>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
