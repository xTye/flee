import { Accessor, Component, For } from "solid-js";
import { UserInterface } from "../../types/UserType";

const UserEditorComponent: Component<{
  insUser: UserInterface;
  setUser: (user: UserInterface) => void;
}> = (props) => {
  return (
    <>
      <div class="flex flex-col md:flex-row gap-6 md:gap-0">
        {/* Add a relative where the width will break the flexbox */}
        <div class="relative w-full flex flex-col gap-6 md:p-8 overflow-hidden">
          <div class="flex items-start gap-4">
            <div class="flex flex-col justify-center gap-6 w-24">
              <div>Name</div>
              <div>Tools</div>
            </div>
            <div class="flex flex-col gap-6 w-full">
              <input
                value={props.insUser.name}
                class="text-black rounded-sm"
                onInput={(e) =>
                  props.setUser({
                    ...props.insUser,
                    name: e.currentTarget.value,
                  })
                }
              />
              <For each={props.insUser.tools}>
                {(tool, i) => (
                  <>
                    <div class="flex">
                      <input
                        value={tool}
                        class="w-full text-black rounded-sm"
                        onInput={(e) => {
                          props.insUser.tools[i()] = e.currentTarget.value;

                          props.setUser(props.insUser);
                        }}
                      />
                      <button class="p-1 hover:bg-red rounded-md">
                        <img
                          src="/util-images/trash.svg"
                          class="w-4 h-4"
                          onClick={() => {
                            console.log();
                            const tools: string[] = [];

                            for (let j = 0; j < props.insUser.tools.length; j++)
                              if (j !== i()) tools.push(props.insUser.tools[j]);

                            props.setUser({
                              ...props.insUser,
                              tools,
                            });
                          }}
                        />
                      </button>
                    </div>
                  </>
                )}
              </For>
              <div class="flex justify-end">
                <button class="p-1 hover:bg-red rounded-md bg-text">
                  <img
                    src="/util-images/plus.svg"
                    class="w-4 h-4"
                    onClick={() => {
                      const tools: string[] = [...props.insUser.tools];
                      tools.push("");
                      console.log(tools);

                      props.setUser({ ...props.insUser, tools });
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4 w-full md:w-2/5">
          <div class="flex items-center gap-8">
            <div>Picture</div>
            <input
              value={props.insUser.picture}
              class="w-full text-black rounded-sm"
              onChange={(e) =>
                props.setUser({
                  ...props.insUser,
                  picture: e.currentTarget.value,
                })
              }
            />
          </div>
          <img
            class="object-cover aspect-square"
            src={
              props.insUser.picture === ""
                ? "/character/character-images/instance.PNG"
                : props.insUser.picture
            }
            alt="User image"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </>
  );
};

export default UserEditorComponent;
