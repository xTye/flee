import {
  Component,
  onMount,
  createSignal,
  createMemo,
  For,
  Show,
} from "solid-js";
import { CalendarClass } from "../classes/CalendarClass";
import { DateInterface } from "../types/DateType";
import { useFetchDate, useUpdateDate } from "../services/DateService";
import { navbarHeight } from "../components/navbar/NavbarComponent";
import { A } from "@solidjs/router";

import ModalComponent from "../components/ModalComponent";
import DatePickerComponent from "../components/DatePickerComponent";
import { useSession } from "../auth";

const CalendarPage: Component = () => {
  const [session, actions] = useSession();
  let calendarDiv = document.createElement("div") as HTMLDivElement;

  const [calendar, setCalendar] = createSignal<CalendarClass>(
    new CalendarClass()
  );

  const [currentDate, setCurrentDate] = createSignal<DateInterface>();
  const [selectedDate, setSelectedDate] = createSignal<DateInterface>();
  const [dates, setDates] = createSignal<DateInterface[]>([]);
  const [modal, setModal] = createSignal<boolean>(false);

  const changeDate = (date: DateInterface) => {
    setSelectedDate(date);
    setDates(calendar().getDates(date));
  };

  createMemo(() => {
    calendarDiv.style.height = window.innerHeight - navbarHeight.height + "px";
  });

  onMount(async () => {
    await calendar().populateEvents();
    const date = await useFetchDate("current");
    setCurrentDate(date);
    setSelectedDate(date);

    setDates(calendar().getDates(date));
  });

  return (
    <>
      <div
        ref={calendarDiv}
        style={{
          height: (calendarDiv.style.height =
            window.innerHeight - navbarHeight.height + "px"),
        }}
        class="relative bg-background p-12"
      >
        <div class="flex flex-col bg-lightPurple h-full rounded-b-md">
          <div class="flex justify-between items-center bg-purple h-20 px-20">
            <Show when={selectedDate()} keyed>
              {(insSelectedDate) => (
                <>
                  <div class="text-text">{`Era: ${
                    insSelectedDate.era
                  } | Year: ${
                    insSelectedDate.year
                  } | Month: ${CalendarClass.getMonthName(
                    insSelectedDate.month
                  )} `}</div>
                  <div class="flex gap-4">
                    <div class="flex">
                      <button
                        class="flex items-center justify-center bg-white h-10 w-10 rounded-l-full hover:bg-red"
                        onClick={() => {
                          if (insSelectedDate.month - 1 == 0) {
                            insSelectedDate.month =
                              CalendarClass.MONTHS_PER_YEAR;

                            if (insSelectedDate.year - 1 == 0) {
                              insSelectedDate.year =
                                CalendarClass.YEARS_PER_ERA;

                              if (insSelectedDate.era - 1 == 0) return;

                              insSelectedDate.era--;
                            } else {
                              insSelectedDate.year--;
                            }
                          } else {
                            insSelectedDate.month--;
                          }

                          changeDate(insSelectedDate);
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
                          if (
                            insSelectedDate.month %
                              CalendarClass.MONTHS_PER_YEAR ==
                            0
                          ) {
                            insSelectedDate.month = 1;

                            if (
                              insSelectedDate.year %
                                CalendarClass.YEARS_PER_ERA ==
                              0
                            ) {
                              insSelectedDate.year = 1;

                              insSelectedDate.era++;
                            } else {
                              insSelectedDate.year++;
                            }
                          } else {
                            insSelectedDate.month++;
                          }

                          changeDate(insSelectedDate);
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
                        <ModalComponent setModal={setModal}>
                          <div class="flex flex-col items-center h-full text-2xl text-white p-5 gap-6">
                            <div class="text-3xl">Enter A Custom Date</div>
                            <DatePickerComponent
                              defaultDate={insSelectedDate}
                              insSelectedDate={insSelectedDate}
                              setDate={changeDate}
                            />
                            <button
                              class="bg-white px-4 rounded-full text-black hover:bg-red"
                              onClick={() => {
                                const insCurrentDate = currentDate();
                                if (!insCurrentDate) return;

                                changeDate(insCurrentDate);
                                setModal(false);
                              }}
                            >
                              Go to current date
                            </button>
                          </div>
                        </ModalComponent>
                      </Show>
                    </button>
                    <Show when={session().admin}>
                      <button
                        class="flex items-center justify-center bg-white h-10 px-2 bg-yellow text-text rounded-full hover:bg-red"
                        onClick={() => {
                          try {
                            useUpdateDate("current", insSelectedDate);
                            setCurrentDate(insSelectedDate);
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      >
                        Set current day
                      </button>
                    </Show>
                  </div>
                </>
              )}
            </Show>
          </div>

          <div class="grid grid-cols-10 grid-rows-3 gap-1 h-full text-sm p-2 select-none overflow-hidden">
            <For each={dates()}>
              {(date) => (
                <div
                  class={`relative flex flex-col bg-${
                    // @ts-ignore
                    CalendarClass.isSameDay(date, selectedDate())
                      ? "red"
                      : // @ts-ignore
                      CalendarClass.isSameDay(date, currentDate())
                      ? "yellow"
                      : "white"
                  } h-full rounded-md hover:bg-red p-2 overflow-hidden hover:overflow-y-auto`}
                  onClick={() => {
                    setSelectedDate(date);
                  }}
                >
                  <div>{date.day}</div>
                  <div>{CalendarClass.getMoonPhase(date.day)}</div>
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

export default CalendarPage;
