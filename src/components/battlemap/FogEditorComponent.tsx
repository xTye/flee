import { BattlemapClass } from "@/classes/battlemap/BattlemapClass";
import { Component, createSignal } from "solid-js";

const FogEditorComponent: Component<{
  battlemap: BattlemapClass;
}> = (props) => {
  const [options, setOptions] = createSignal({
    fog: props.battlemap.map.hasLayer(props.battlemap.fog.layer),
  });

  return (
    <>
      <div class="flex items-center gap-4">
        <input
          type="checkbox"
          checked={options().fog}
          class="w-4 h-4"
          onInput={() => {
            props.battlemap.fog.toggle(!options().fog);

            setOptions({
              ...options(),
              fog: !options().fog,
            });
          }}
        />
        <div>Fog</div>
      </div>
    </>
  );
};

export default FogEditorComponent;
