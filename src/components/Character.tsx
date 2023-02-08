import type { Component } from "solid-js";
import { A } from "@solidjs/router";

const Character: Component<{
  image: string;
  name: string;
  class: string;
  title: string;
  description: string;
  mainAttack: string;
  mainAttackImage: string;
}> = (props) => {
  return (
    <>
      <div class="flex flex-col gap-4 p-10 w-1/4">
        <img class="w-full" src={props.image} alt="character" />
        <div class="flex justify-between text-lg">
          <div>{props.name}</div>
          <div>{props.class}</div>
        </div>
        <div class="text-sm text-yellow">{props.title}</div>
        <div class="text-sm">{props.description}</div>
        <div class="flex justify-between gap-2 items-center">
          <div class="text-sm">{props.mainAttack}</div>
          <img class="w-1/5" src={props.mainAttackImage} alt="main attack" />
        </div>
        <div class="flex justify-center">
          <button class="w-3/5 h-10 bg-yellow text-center rounded-full hover:bg-red">
            Read more!
          </button>
        </div>
      </div>
    </>
  );
};

export default Character;
