import { Component, createSignal, onCleanup } from "solid-js";
import { BattlemapInterface } from "../../types/BattlemapType";
import {
  resizeImage,
  toggleGrid,
  useGridLayer,
} from "../../hooks/BattlemapHooks";

const GridEditorComponent: Component<{ battlemap: BattlemapInterface }> = (
  props
) => {
  const battlemap = props.battlemap;

  const [options, setOptions] = createSignal({
    grid: battlemap.grid.show,
    size: battlemap.grid.cellSize,
  });

  let resizeGridRef: NodeJS.Timeout | undefined = undefined;
  const resizeGrid = (value: number) => {
    if (resizeGridRef) clearTimeout(resizeGridRef);
    resizeGridRef = setTimeout(async () => {
      if (battlemap.grid.cellSize === value) return;
      battlemap.grid.layer.removeFrom(battlemap.map);
      battlemap.grid = useGridLayer(battlemap, value);
      resizeGridRef = undefined;

      for (const [id, token] of battlemap.token.tokens)
        resizeImage(battlemap, token);

      for (const [id, asset] of battlemap.background.assets)
        resizeImage(battlemap, asset);
    }, 500);
  };

  onCleanup(() => {
    if (resizeGridRef) clearTimeout(resizeGridRef);
  });

  return (
    <>
      <div class="flex items-center gap-4">
        <input
          type="checkbox"
          checked={options().grid}
          class="w-4 h-4"
          onInput={() => {
            toggleGrid(battlemap, !options().grid);

            setOptions({
              ...options(),
              grid: !options().grid,
            });
          }}
        />
        <div>Grid</div>
      </div>
      <div class="flex justify-center items-center gap-4">
        <div class="px-2">Cell size</div>
        <input
          type="range"
          min="3"
          max="10"
          step=".1"
          value={options().size}
          onInput={(e) => {
            const value = (e.currentTarget as HTMLInputElement).valueAsNumber;

            resizeGrid(value);

            setOptions({
              ...options(),
              size: value,
            });
          }}
        />
        <input
          type="text"
          value={options().size}
          class="text-black px-2 w-12 rounded-md"
          onInput={(e) => {
            const value = Number.parseInt(e.currentTarget.value);
            if (Number.isNaN(value) || value > 10 || value < 3) return;
            resizeGrid(value);
            setOptions({
              ...options(),
              size: value,
            });
          }}
        />
      </div>
    </>
  );
};

export default GridEditorComponent;
