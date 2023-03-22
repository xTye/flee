import {
  Component,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from "solid-js";
import {
  BattlemapInterface,
  MovableType,
  TokenInterface,
} from "../../types/BattlemapType";
import { resizeImage } from "../../hooks/BattlemapHooks";
import {
  addImageOverlayMouseOutListener,
  addImageOverlayMouseOverListener,
  addImageOverlayMoveListener,
  removeImageOverlayMouseOutListener,
  removeImageOverlayMouseOverListener,
  removeImageOverlayMoveListener,
} from "../../hooks/battlemap-utils/eventListenerUtil";

const TokenEditorComponent: Component<{ battlemap: BattlemapInterface }> = (
  props
) => {
  const battlemap = props.battlemap;

  return (
    <>
      <Show
        when={battlemap.token.selected()}
        fallback={<div>Select a token to show options</div>}
      >
        <select
          class="text-black rounded-md"
          onChange={(e) => {
            const value = e.currentTarget.value as MovableType;
            const token = battlemap.token.selected() as TokenInterface;

            token.movable.type = value;

            if (value === "none") {
              removeImageOverlayMoveListener(token);
              removeImageOverlayMouseOverListener(token);
              removeImageOverlayMouseOutListener(token);
            }
            if (value !== "none" && !token.overlay.listens("mousedown")) {
              addImageOverlayMoveListener(battlemap, token);
              addImageOverlayMouseOverListener(battlemap, token);
              addImageOverlayMouseOutListener(battlemap, token);
            }

            battlemap.token.setSelected({ ...token });
          }}
        >
          <option
            selected={battlemap.token.selected()?.movable.type === "none"}
            value="none"
          >
            Lock
          </option>
          <option
            selected={battlemap.token.selected()?.movable.type === "free"}
            value="free"
          >
            Free
          </option>
          <option
            selected={battlemap.token.selected()?.movable.type === "grid"}
            value="grid"
          >
            Grid
          </option>
        </select>
        <div class="flex justify-center items-center gap-4">
          <div class="px-2">Scale</div>
          <input
            type="range"
            min=".1"
            max="10"
            step=".1"
            value={battlemap.token.selected()?.scale}
            onInput={(e) => {
              const value = (e.currentTarget as HTMLInputElement).valueAsNumber;
              const token = battlemap.token.selected() as TokenInterface;

              token.scale = value;
              resizeImage(battlemap, token);

              battlemap.token.setSelected({ ...token });
            }}
          />
          <input
            type="text"
            value={battlemap.token.selected()?.scale}
            class="text-black px-2 w-12 rounded-md"
            onInput={(e) => {
              const value = Number.parseInt(e.currentTarget.value);
              if (Number.isNaN(value) || value > 10 || value < 0.1) return;

              const token = battlemap.token.selected() as TokenInterface;

              token.scale = value;
              resizeImage(battlemap, token);

              battlemap.token.setSelected({ ...token });
            }}
          />
        </div>
      </Show>
    </>
  );
};

export default TokenEditorComponent;
