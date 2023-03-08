import {
  Accessor,
  Component,
  For,
  JSX,
  Setter,
  Show,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import LoadingComponent from "./LoadingComponent";
import { clickOutside } from "../../utils/clickOutside";
const SearchBarComponent: Component<{
  queryBegin?: string;
  useFetch: (query: string) => Promise<any[] | undefined>;
  itemComponent: (
    item: any,
    i: Accessor<number>,
    setSelectedMedia: Setter<boolean>
  ) => JSX.Element;
}> = (props) => {
  const [showResults, setShowResults] = createSignal(false);
  const [results, setResults] = createSignal<any[]>([]);
  const [fetching, setFetching] = createSignal(false);

  let fetchRef: NodeJS.Timeout | undefined = undefined;
  const fetch = (query: string) => {
    setFetching(true);
    if (fetchRef) clearTimeout(fetchRef);
    fetchRef = setTimeout(async () => {
      const res = await props.useFetch(query);
      if (res) setResults(res);
      setFetching(false);
      fetchRef = undefined;
    }, 500);
  };

  let parentDiv = document.createElement("div") as HTMLDivElement;

  onMount(() => {
    clickOutside(parentDiv, () => setShowResults(false), parentDiv);
  });

  onCleanup(() => {
    if (fetchRef) clearTimeout(fetchRef);
  });

  return (
    <>
      <div ref={parentDiv} class="relative">
        <input
          type="text"
          placeholder="Search..."
          class="w-full border-2 border-black rounded-md px-2 hover:outline-none"
          onFocusIn={() => {
            setShowResults(true);
          }}
          onInput={(e) => {
            fetch(props.queryBegin || "" + e.currentTarget.value);
          }}
        />
        <Show when={showResults()}>
          <div class="">
            <div class="absolute left-0 h-40 w-full z-[4000] bg-lightWhite border-x-2 border-b-2 rounded-b-md overflow-x-hidden overflow-y-auto">
              <Show
                when={!fetching()}
                fallback={<LoadingComponent color={"black"} />}
              >
                <For each={results()}>
                  {(result, i) => (
                    <div
                      class={`${
                        i() === results().length - 1 ? "" : "border-b-2"
                      } hover:bg-white p-2`}
                    >
                      {props.itemComponent(result, i, setShowResults)}
                    </div>
                  )}
                </For>
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </>
  );
};

export default SearchBarComponent;
