import { Component, createSignal, onMount, Show } from "solid-js";
import { useSession } from "../auth";
import { useNavigate, useParams, A } from "@solidjs/router";

import TeaserEditorComponent from "../components/teasers/TeaserEditorComponent";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseStore } from "..";
import { Editor } from "@tiptap/core";
import { TeaserInterface } from "../types/TeaserType";
import {
  useDeleteTeaser,
  useFetchTeaser,
  useUpdateTeaser,
} from "../services/TeaserService";
import LoadingComponent from "../components/utils/LoadingComponent";

const UpdateTeaserEditorPage: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  const params = useParams();

  const [teaser, setTeaser] = createSignal<TeaserInterface>();
  const [editor, setEditor] = createSignal<Editor>();
  const [at, setAt] = createSignal(false);
  const [publish, setPublish] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  let editorDefaultContent = "";

  if (session().status === "loading") return <div>Loading</div>;

  if (!session().admin || session().status === "unauthenticated") {
    navigate("/", { replace: true });
    return <div>Not admin</div>;
  }

  onMount(async () => {
    const teaser = await useFetchTeaser(params.id);
    editorDefaultContent = teaser?.content || "";
    teaser ? setTeaser(teaser) : navigate("/");
  });

  return (
    <>
      <div class="flex flex-col gap-4 min-h-screen bg-background text-text p-4 sm:p-10 lg:p-20">
        <div class="flex flex-col gap-4 sm:flex-row justify-between items-center">
          <div class="text-4xl">Update Teaser</div>
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
                  (await useDeleteTeaser(teaser()?.id || "")) &&
                    navigate("/teasers");

                  setLoading(false);
                }}
                class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
              >
                Delete Teaser
              </button>
              <button
                onClick={async () => {
                  if (loading()) return;
                  setLoading(true);
                  const insTeaser = teaser();
                  if (!insTeaser) return;

                  (await useUpdateTeaser({
                    ...insTeaser,
                    at: at(),
                    publish: publish(),
                  })) && navigate("/teasers");

                  setLoading(false);
                }}
                class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
              >
                Update Teaser
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
          <Show when={teaser()} fallback={<LoadingComponent />}>
            <TeaserEditorComponent
              setEditor={setEditor}
              editorDefaultContent={editorDefaultContent}
              // @ts-ignore
              teaser={teaser}
              setTeaser={setTeaser}
            />
          </Show>
        </Show>
      </div>
    </>
  );
};

export default UpdateTeaserEditorPage;
