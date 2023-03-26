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
  MovableByType,
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
import { useSession } from "../../auth";

const TokenEditorComponent: Component<{ battlemap: BattlemapInterface }> = (
  props
) => {
  const [session, actions] = useSession();
  const battlemap = props.battlemap;

  const [options, setOptions] = createSignal<
    Partial<TokenInterface> & { movable: Partial<TokenInterface["movable"]> }
  >({
    movable: {
      type: "none",
      by: "grid",
    },
    scale: 1,
    rotation: 0,
  });

  return (
    <>
      <Show
        when={battlemap.token.selected()}
        fallback={<div>Select token(s) to show options</div>}
        keyed
      >
        {(insTokens) => {
          const startToken = [...insTokens.values()][0] as TokenInterface;

          let movable: Partial<TokenInterface["movable"]> = startToken.movable;
          let scale: number | undefined = startToken.scale;
          let rotation: number | undefined = startToken.rotation;

          if (insTokens.size === 1) {
          } else if (insTokens.size > 1) {
            for (const [key, token] of insTokens) {
              if (!movable.type && token.movable.type !== movable.type)
                movable.type = undefined;
              if (!movable.by && token.movable.by !== movable.by)
                movable.by = undefined;
              if (!movable && token.scale !== scale) scale = undefined;
              if (!movable && token.rotation !== rotation) rotation = undefined;
            }
          }

          setOptions({
            movable,
            scale,
            rotation,
          });

          return (
            <>
              <div class="flex items-center gap-4">
                <div class="px-2">Movement Type</div>
                <select
                  class="text-black rounded-md"
                  onChange={(e) => {
                    const value = e.currentTarget.value as MovableType;
                    if (value === undefined) return;

                    let movable = {} as TokenInterface["movable"];

                    for (const [key, token] of insTokens) {
                      token.movable.type = value;

                      if (value === "none") {
                        removeImageOverlayMoveListener(token);
                        removeImageOverlayMouseOverListener(token);
                        removeImageOverlayMouseOutListener(token);
                      }
                      if (
                        value !== "none" &&
                        !token.overlay.listens("mousedown")
                      ) {
                        addImageOverlayMoveListener(battlemap, token);
                        addImageOverlayMouseOverListener(battlemap, token);
                        addImageOverlayMouseOutListener(battlemap, token);
                      }

                      movable = token.movable;
                    }

                    setOptions({
                      ...options(),
                      movable,
                    });
                  }}
                >
                  <option value={undefined}>{"Select..."}</option>
                  <option
                    selected={options().movable?.type === "none"}
                    value="none"
                  >
                    Lock
                  </option>
                  <option
                    selected={options().movable?.type === "free"}
                    value="free"
                  >
                    Free
                  </option>
                  <option
                    selected={options().movable?.type === "grid"}
                    value="grid"
                  >
                    Grid
                  </option>
                </select>
              </div>
              <div class="flex items-center gap-4">
                <div class="px-2">Movement By</div>
                <select
                  class="text-black rounded-md"
                  onChange={(e) => {
                    const value = e.currentTarget.value as MovableByType;
                    if (value === undefined) return;

                    let movable = {} as TokenInterface["movable"];

                    for (const [key, token] of insTokens) {
                      token.movable.by = value;

                      if (value !== "all" && session().user?.uid !== value) {
                        removeImageOverlayMoveListener(token);
                        removeImageOverlayMouseOverListener(token);
                        removeImageOverlayMouseOutListener(token);
                      }
                      if (
                        value === "all" &&
                        !token.overlay.listens("mousedown")
                      ) {
                        addImageOverlayMoveListener(battlemap, token);
                        addImageOverlayMouseOverListener(battlemap, token);
                        addImageOverlayMouseOutListener(battlemap, token);
                      }

                      movable = token.movable;
                    }

                    setOptions({
                      ...options(),
                      movable,
                    });
                  }}
                >
                  <option
                    selected={options().movable?.by === "all"}
                    value="all"
                  >
                    All
                  </option>
                  <option
                    selected={
                      options().movable?.by === "lVazTFAe2Ecxy8RWt4398T3kDvs1"
                    }
                    value="lVazTFAe2Ecxy8RWt4398T3kDvs1"
                  >
                    Tye
                  </option>
                  <option
                    selected={
                      options().movable?.by === "ITdX1R4i28T5R4uymgdJpET21Y02"
                    }
                    value="ITdX1R4i28T5R4uymgdJpET21Y02"
                  >
                    Connar
                  </option>
                </select>
              </div>
              <div class="flex items-center gap-4">
                <div class="px-2">Scale</div>
                <input
                  type="range"
                  min=".1"
                  max="10"
                  step=".1"
                  value={options().scale || 1}
                  onInput={(e) => {
                    const value = (e.currentTarget as HTMLInputElement)
                      .valueAsNumber;

                    let scale = 1;

                    for (const [key, token] of insTokens) {
                      token.scale = value;
                      resizeImage(battlemap, token);
                      scale = token.scale;
                    }

                    setOptions({
                      ...options(),
                      scale,
                    });
                  }}
                />
                <input
                  type="text"
                  value={options().scale || 1}
                  class="text-black px-2 w-12 rounded-md"
                  onInput={(e) => {
                    const value = Number.parseInt(e.currentTarget.value);
                    if (Number.isNaN(value) || value > 10 || value < 0.1)
                      return;

                    let scale = 1;

                    for (const [key, token] of insTokens) {
                      token.scale = value;
                      resizeImage(battlemap, token);
                      scale = token.scale;
                    }

                    setOptions({
                      ...options(),
                      scale,
                    });
                  }}
                />
              </div>
              <div class="flex items-center gap-4">
                <div class="px-2">Rotation</div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="90"
                  value={options().rotation || 0}
                  onInput={(e) => {
                    const value = (e.currentTarget as HTMLInputElement)
                      .valueAsNumber;

                    let rotation = 0;

                    for (const [key, token] of insTokens) {
                      token.rotation = value;
                      resizeImage(battlemap, token);
                      rotation = token.rotation;
                    }

                    setOptions({
                      ...options(),
                      rotation,
                    });
                  }}
                />
                <input
                  type="text"
                  value={options().rotation || 0}
                  class="text-black px-2 w-12 rounded-md"
                  onInput={(e) => {
                    const value = Number.parseInt(e.currentTarget.value);
                    if (Number.isNaN(value) || Math.abs(value) % 90 !== 0)
                      return;

                    let rotation = 0;

                    for (const [key, token] of insTokens) {
                      token.rotation = value;
                      resizeImage(battlemap, token);
                      rotation = token.rotation;
                    }

                    setOptions({
                      ...options(),
                      rotation,
                    });
                  }}
                />
              </div>
            </>
          );
        }}
      </Show>
    </>
  );
};

export default TokenEditorComponent;
