/* @refresh solid */
import {
  Component,
  For,
  Show,
  createMemo,
  createSignal,
  onMount,
} from "solid-js";
import SearchBarComponent from "./SearchBarComponent";
import { MediaInterface } from "../../types/MediaType";
import {
  useCreateMedia,
  useDeleteMedia,
  useFetchMediaFromQuery,
  useFetchMedias,
  useUpdateDatabaseMedia,
} from "../../services/MediaService";

const YoutubeMenuComponent: Component = (props) => {
  const [selectedMedia, setSelectedMedia] = createSignal<MediaInterface>();
  const [favoriteMedia, setFavoriteMedia] = createSignal<MediaInterface[]>();
  const [options, setOptions] = createSignal({
    autoplay: true,
    loop: true,
  });

  const favoriteMediaMap = new Map<string, MediaInterface>();

  const favorited = createMemo(() => {
    const media = favoriteMedia();
    return favoriteMediaMap.get(selectedMedia()?.id || "");
  });

  onMount(async () => {
    const medias = await useFetchMedias();
    if (!medias) return;

    for (const media of medias) favoriteMediaMap.set(media.id, media);

    setFavoriteMedia(medias);
  });

  return (
    <>
      <div class="flex flex-col gap-2 bg-lightPurple p-2 rounded-t-md">
        <div class="flex items-center justify-between">
          <SearchBarComponent
            useFetch={useFetchMediaFromQuery}
            itemComponent={(item, i, setShowResults) => (
              <>
                <button
                  onClick={() => {
                    setSelectedMedia(item);
                    setShowResults(false);
                  }}
                >
                  <div class="flex items-center gap-1">
                    <img src={item.thumbnail} class="h-4" />
                    <div class="text-sm">{item.title}</div>
                  </div>
                </button>
              </>
            )}
          />
          <Show when={favoriteMedia()}>
            <select
              class="text-black rounded-md w-32"
              onChange={(e) => {
                const media = favoriteMediaMap.get(e.currentTarget.value);
                setSelectedMedia(media);
              }}
            >
              <option value={undefined}>{"Select..."}</option>
              <For each={favoriteMedia()}>
                {(media) => (
                  <>
                    <option
                      selected={(selectedMedia()?.id || "") === media.id}
                      value={media.id}
                    >
                      {media.title}
                    </option>
                  </>
                )}
              </For>
            </select>
          </Show>
          <div class="flex items-center gap-1">
            <button
              class="flex items-center justify-center w-8 h-8 bg-yellow rounded-full hover:bg-red text-text"
              onClick={async () => {
                const insPlayingMedia = selectedMedia();
                if (!insPlayingMedia) return;

                if (favoriteMediaMap.get(insPlayingMedia.id)) {
                  const res = await useDeleteMedia(insPlayingMedia);
                  if (!res) return;

                  favoriteMediaMap.delete(insPlayingMedia.id);
                  setFavoriteMedia([...favoriteMediaMap.values()]);
                } else {
                  const res = await useCreateMedia(insPlayingMedia);
                  if (!res) return;

                  favoriteMediaMap.set(insPlayingMedia.id, insPlayingMedia);
                  setFavoriteMedia([...favoriteMediaMap.values()]);
                }
              }}
            >
              <Show
                when={favorited()}
                fallback={
                  <img src={"/util-images/heart-empty.svg"} class="w-4 h-4" />
                }
              >
                <img src={"/util-images/heart-full.svg"} class="w-4 h-4" />
              </Show>
            </button>
            <button
              class="flex items-center justify-center w-8 h-8 bg-yellow rounded-full hover:bg-red text-text"
              onClick={async () => {
                await useUpdateDatabaseMedia(undefined);
              }}
            >
              <img src="/util-images/stop.svg" class="w-4 h-4" />
            </button>
            <button
              class="flex items-center justify-center w-8 h-8 bg-yellow rounded-full hover:bg-red text-text"
              onClick={async () => {
                await useUpdateDatabaseMedia(selectedMedia(), options());
              }}
            >
              <img src="/util-images/arrow.svg" class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div class="text-small truncate">
            Queue: {selectedMedia()?.title || ""}
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-4">
              <input
                type="checkbox"
                checked={options().autoplay}
                class="w-4 h-4"
                onInput={() => {
                  setOptions({
                    ...options(),
                    autoplay: !options().autoplay,
                  });
                }}
              />
              <div>Autoplay</div>
            </div>
            <div class="flex items-center gap-4">
              <input
                type="checkbox"
                checked={options().loop}
                class="w-4 h-4"
                onInput={() => {
                  setOptions({
                    ...options(),
                    loop: !options().loop,
                  });
                }}
              />
              <div>Loop</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default YoutubeMenuComponent;
