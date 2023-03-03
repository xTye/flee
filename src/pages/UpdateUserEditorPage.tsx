import { Component, createSignal, onMount, Show } from "solid-js";
import { useSession } from "../auth";
import { useNavigate, useParams, A } from "@solidjs/router";

import UserEditorComponent from "../components/users/UserEditorComponent";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseStore } from "..";
import { Editor } from "@tiptap/core";
import { UserInterface } from "../types/UserType";
import { useFetchUser, useUpdateUser } from "../services/UserService";

const UpdateUserEditorPage: Component = () => {
  const [session, actions] = useSession();
  const navigate = useNavigate();
  const params = useParams();

  const [user, setUser] = createSignal<UserInterface | undefined>();
  const [editor, setEditor] = createSignal<Editor>();
  // const [editorDefaultContent, setEditorDefaultContent] =
  //   createSignal<string>("");
  let editorDefaultContent = "";

  if (session().status === "loading") return <div>Loading</div>;

  if (!session().admin || session().status === "unauthenticated") {
    navigate("/");
    return <div>Not admin</div>;
  }

  if (params.id != session().user?.uid && !session().admin) {
    navigate("/dashboard");
    return <div>Can't edit other user</div>;
  }

  onMount(async () => {
    const user = await useFetchUser(params.id);
    user
      ? setUser({
          ...user,
          name: session().user?.displayName || "",
          picture: session().user?.photoURL || "",
        })
      : navigate("/dashboard");
  });

  const updateUser = async () => {
    const insUser = user();
    if (!insUser || !insUser.id) throw new Error("User is not defined");

    console.log("Updating user...");
    useUpdateUser(insUser.id, insUser, actions);
    console.log("Updated user");
    navigate(`/dashboard`);
  };

  return (
    <>
      <div class="flex flex-col gap-4 min-h-screen bg-background text-text p-4 sm:p-10 lg:p-20">
        <div class="flex flex-col gap-4 sm:flex-row justify-between items-center">
          <div class="text-4xl">Update User</div>
          <div class="flex gap-4">
            <A
              href={`/dashboard`}
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Go to Dashboard
            </A>
            <button
              onClick={() => updateUser()}
              class="flex items-center justify-center w-32 h-10 bg-yellow rounded-full hover:bg-red"
            >
              Save
            </button>
          </div>
        </div>
        <Show when={user() != undefined}>
          <UserEditorComponent
            setEditor={setEditor}
            editorDefaultContent={editorDefaultContent}
            // @ts-ignore
            user={user}
            setUser={setUser}
          />
        </Show>
      </div>
    </>
  );
};

export default UpdateUserEditorPage;
