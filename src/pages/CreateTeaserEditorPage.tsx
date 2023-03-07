import { Component, Show, createSignal } from "solid-js";
import { useSession } from "../auth";
import { A, useNavigate } from "@solidjs/router";

import TeaserEditorComponent from "../components/teasers/TeaserEditorComponent";
import { Editor } from "@tiptap/core";

import { TeaserInterface } from "../types/TeaserType";
import { useCreateTeaser } from "../services/TeaserService";
import LoadingComponent from "../components/utils/LoadingComponent";

const CreateTeaserEditorPage: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  const [teaser, setTeaser] = createSignal<TeaserInterface>({
    id: "",
    content: "",
  });
  const [editor, setEditor] = createSignal<Editor>();
  const [at, setAt] = createSignal(true);
  const [publish, setPublish] = createSignal(true);
  const [loading, setLoading] = createSignal(false);

  if (session().status === "loading") return <div>Loading</div>;

  if (!session().admin || session().status === "unauthenticated") {
    navigate("/", { replace: true });
    return <div>Not admin</div>;
  }

  return (
    <>
      <div class="flex flex-col gap-4 min-h-screen bg-background text-text p-4 sm:p-10 lg:p-20">
        <div class="flex flex-col gap-4 sm:flex-row justify-between items-center">
          <div class="text-4xl">Create Teaser</div>
          <div class="flex gap-4">
            <Show when={!loading()}>
              <A
                href="/teasers"
                class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
              >
                Go to Teasers
              </A>
              <button
                onClick={async () => {
                  if (loading()) return;
                  setLoading(true);
                  (await useCreateTeaser({
                    ...teaser(),
                    at: at(),
                    publish: publish(),
                  })) && navigate("/teasers");

                  setLoading(false);
                }}
                class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
              >
                Post Teaser
              </button>
            </Show>
          </div>
        </div>
        <Show when={!loading()} fallback={<LoadingComponent />}>
          <div class="flex items-center gap-4">
            <input
              type="checkbox"
              checked={at()}
              class="w-4 h-4"
              onInput={() => {
                setAt(!at());
              }}
            />
            <div>@The Wandering Eyes</div>
          </div>
          <div class="flex items-center gap-4">
            <input
              type="checkbox"
              checked={publish()}
              class="w-4 h-4"
              onInput={() => {
                setPublish(!publish());
              }}
            />
            <div>Publish On Discord</div>
          </div>
          <TeaserEditorComponent
            setEditor={setEditor}
            teaser={teaser}
            setTeaser={setTeaser}
          />
        </Show>
      </div>
    </>
  );
};

export default CreateTeaserEditorPage;
