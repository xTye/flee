import { Component, createSignal } from "solid-js";
import { toggleFog } from "../../hooks/BattlemapHooks";
import { BattlemapInterface } from "../../types/BattlemapType";

const FogEditorComponent: Component<{
  battlemap: BattlemapInterface;
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
            toggleFog(props.battlemap, !options().fog);

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
