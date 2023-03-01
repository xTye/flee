import { Component, For, createSignal } from "solid-js";
import Leaflet from "leaflet";
import { MarkerInterface } from "../../types/MarkerType";
import { icons } from "../../hooks/MapHooks";

interface Props {
  insEditMarker: MarkerInterface;
  leafletMarker: Leaflet.Marker;
  setEditMarker: (marker: MarkerInterface) => void;
}

const MarkerEditorComponent: Component<Props> = (props) => {
  return (
    <>
      <div class="flex gap-1 h-full overflow-y-auto">
        <div class="flex flex-col gap-1 font-bold">
          <div>Name:</div>
          <div>Description:</div>
          <div>X:</div>
          <div>Y:</div>
          <div>Color:</div>
          <div>Maps:</div>
        </div>
        <div class="flex flex-col gap-1">
          <input
            value={props.insEditMarker.name}
            class="w-full bg-lightWhite focus:outline-none"
            onChange={(e) => {
              props.setEditMarker({
                ...props.insEditMarker,
                name: e.currentTarget.value,
              });
            }}
          />

          <input
            value={props.insEditMarker.description}
            class="w-full bg-lightWhite focus:outline-none"
            onChange={(e) => {
              props.setEditMarker({
                ...props.insEditMarker,
                description: e.currentTarget.value,
              });
            }}
          />

          <div>{props.insEditMarker.x}</div>
          <div>{props.insEditMarker.y}</div>

          <select
            class="rounded-sm"
            onChange={(e) => {
              const color = e.currentTarget.value;

              props.leafletMarker.setIcon(icons[color]);

              props.setEditMarker({
                ...props.insEditMarker,
                color,
              });
            }}
          >
            <option
              selected={
                !props.insEditMarker.color ||
                props.insEditMarker.color === "black"
              }
              value={"black"}
            >
              Black
            </option>
            <option
              selected={props.insEditMarker.color === "red"}
              value={"red"}
            >
              Red
            </option>
            <option
              selected={props.insEditMarker.color === "blue"}
              value={"blue"}
            >
              Blue
            </option>
            <option
              selected={props.insEditMarker.color === "gold"}
              value={"gold"}
            >
              Gold
            </option>
          </select>

          <For each={props.insEditMarker.maps}>
            {(map, i) => (
              <>
                <div class="flex">
                  <input
                    value={map}
                    class="w-full bg-lightWhite focus:outline-none"
                    onChange={(e) => {
                      props.insEditMarker.maps[i()] = e.currentTarget.value;

                      props.setEditMarker(props.insEditMarker);
                    }}
                  />
                  <button class="p-1 hover:bg-red rounded-md">
                    <img
                      src="/util-images/trash.svg"
                      class="w-4 h-4"
                      onClick={() => {
                        const maps: string[] = [];

                        for (
                          let j = 0;
                          j < props.insEditMarker.maps.length;
                          j++
                        )
                          if (j !== i()) maps.push(props.insEditMarker.maps[j]);

                        props.setEditMarker({
                          ...props.insEditMarker,
                          maps,
                        });
                      }}
                    />
                  </button>
                </div>
              </>
            )}
          </For>

          <div class="flex justify-end">
            <button class="p-1 hover:bg-red rounded-md">
              <img
                src="/util-images/plus.svg"
                class="w-4 h-4"
                onClick={() => {
                  const maps: string[] = [...props.insEditMarker.maps];
                  maps.push("");

                  props.setEditMarker({ ...props.insEditMarker, maps });
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkerEditorComponent;
