import type { Component } from "solid-js";

import Character from "../components/Character";

const Characters: Component = () => {
  return (
    <>
      <div class="min-h-screen bg-background text-text pt-10">
        <div class="flex justify-between">
          <Character
            image={"./character.png"}
            name={"Rashaga Taga"}
            class={"Sorcerer 5 | Bard 1"}
            title={"A feline menace"}
            description={
              "This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. s"
            }
            mainAttack={"Fireball"}
            mainAttackImage={"./logo-edited.png"}
          />
          <Character
            image={"./character.png"}
            name={"Instance Number 2"}
            class={"Psion 5 | Wizard 1"}
            title={"A jumpy grey boy"}
            description={
              "This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. s"
            }
            mainAttack={"Phase rift into phase shot"}
            mainAttackImage={"./logo-edited.png"}
          />
          <Character
            image={"./character.png"}
            name={"Nola"}
            class={"Paladin 6"}
            title={"A sassy woman"}
            description={
              "This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. s"
            }
            mainAttack={"Divine smite"}
            mainAttackImage={"./logo-edited.png"}
          />
          <Character
            image={"./character.png"}
            name={"Noc"}
            class={"Warlock 6"}
            title={"A dead changling"}
            description={
              "This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. This is the character description. s"
            }
            mainAttack={"Hexblades curse multiattack"}
            mainAttackImage={"./logo-edited.png"}
          />
        </div>
      </div>
    </>
  );
};

export default Characters;
