import {
  Accessor,
  Component,
  For,
  JSX,
  Show,
  createSignal,
  onCleanup,
} from "solid-js";
import LoadingComponent from "./LoadingComponent";
const SearchBarComponent: Component<{
  queryBegin?: string;
  useFetch: (query: string) => Promise<any[] | undefined>;
  itemComponent: (item: any, i: Accessor<number>) => JSX.Element;
}> = (props) => {
  const [showResults, setShowResults] = createSignal(true);
  const [results, setResults] = createSignal<any[]>([]);
  const [fetching, setFetching] = createSignal(false);

  let fetchRef: NodeJS.Timeout | undefined = undefined;
  const fetch = (query: string) => {
    setFetching(true);
    if (fetchRef) clearTimeout(fetchRef);
    fetchRef = setTimeout(async () => {
      console.log(results());
      const res = await props.useFetch(query);
      if (res) setResults(res);
      console.log(res);
      setFetching(false);
      fetchRef = undefined;
    }, 500);
  };

  onCleanup(() => {
    if (fetchRef) clearTimeout(fetchRef);
  });

  return (
    <>
      <div class="relative">
        <input
          type="text"
          placeholder="Search..."
          class="w-full border-2 border-black rounded-md px-2 hover:outline-none"
          onFocusIn={() => {
            setShowResults(true);
          }}
          onFocusOut={() => {
            setShowResults(false);
          }}
          onInput={(e) => {
            fetch(props.queryBegin || "" + e.currentTarget.value);
          }}
        />
        <Show when={showResults()}>
          <div class="overflow-hidden">
            <div class="absolute left-0 h-40 w-full z-[4000] bg-lightWhite border-x-2 border-b-2 rounded-b-md overflow-y-auto">
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
                      {props.itemComponent(result, i)}
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
