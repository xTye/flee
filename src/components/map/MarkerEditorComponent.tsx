import { Component, createSignal } from "solid-js";
import Leaflet from "leaflet";
import { MarkerInterface } from "../../types/MarkerType";
import { icons } from "../../hooks/MapHook";

interface Props {
  marker: MarkerInterface;
  leafletMarker: Leaflet.Marker;
  setMarker: (marker: MarkerInterface) => void;
}

const MarkerEditorComponent: Component<Props> = (props) => {
  return (
    <>
      <div class="flex gap-1">
        <div class="flex flex-col gap-1 font-bold">
          <div>Name:</div>
          <div>Description:</div>
          <div>X:</div>
          <div>Y:</div>
          <div>Color:</div>
        </div>
        <div class="flex flex-col gap-1">
          <input
            value={props.marker.name}
            class="bg-lightWhite focus:outline-none"
            onChange={(e) => {
              props.setMarker({
                ...props.marker,
                name: e.currentTarget.value,
              });
            }}
          />

          <input
            value={props.marker.description}
            class="bg-lightWhite focus:outline-none"
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
        </div>
      </div>
    </>
  );
};

export default MarkerEditorComponent;
