import { Component, For, createSignal } from "solid-js";
import Leaflet from "leaflet";
import { MarkerInterface } from "../../types/MarkerType";
import { icons } from "../../hooks/MapHooks";

interface Props {
  marker: MarkerInterface;
  leafletMarker: Leaflet.Marker;
  setMarker: (marker: MarkerInterface) => void;
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
            value={props.marker.name}
            class="w-full bg-lightWhite focus:outline-none"
            onChange={(e) => {
              props.setMarker({
                ...props.marker,
                name: e.currentTarget.value,
              });
            }}
          />

          <input
            value={props.marker.description}
            class="w-full bg-lightWhite focus:outline-none"
            onChange={(e) => {
              props.setMarker({
                ...props.marker,
                description: e.currentTarget.value,
              });
            }}
          />

          <div>{props.marker.x}</div>
          <div>{props.marker.y}</div>

          <select
            class="rounded-sm"
            onChange={(e) => {
              const color = e.currentTarget.value;

              props.leafletMarker.setIcon(icons[color]);

              props.setMarker({
                ...props.marker,
                color,
              });
            }}
          >
            <option
              selected={!props.marker.color || props.marker.color === "black"}
              value={"black"}
            >
              Black
            </option>
            <option selected={props.marker.color === "red"} value={"red"}>
              Red
            </option>
            <option selected={props.marker.color === "blue"} value={"blue"}>
              Blue
            </option>
            <option selected={props.marker.color === "gold"} value={"gold"}>
              Gold
            </option>
          </select>

          <For each={props.marker.maps}>
            {(map, i) => (
              <>
                <div class="flex">
                  <input
                    value={map}
                    class="w-full bg-lightWhite focus:outline-none"
                    onChange={(e) => {
                      props.marker.maps[i()] = e.currentTarget.value;

                      props.setMarker(props.marker);
                    }}
                  />
                  <button class="p-1 hover:bg-red rounded-md">
                    <img
                      src="/util-images/trash.svg"
                      class="w-4 h-4"
                      onClick={() => {
                        const maps: string[] = [];

                        for (let j = 0; j < props.marker.maps.length; j++)
                          if (j !== i()) maps.push(props.marker.maps[j]);

                        props.setMarker({
                          ...props.marker,
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
                  props.marker.maps.push("");

                  props.setMarker({ ...props.marker });
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
