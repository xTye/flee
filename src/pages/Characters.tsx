import type { Component } from "solid-js";

import Character from "../components/Character";

const Characters: Component = () => {
  return (
    <>
      <div class="min-h-screen bg-background text-text pt-10">
        <div class="flex justify-between">
          <Character
            image={"./rashaga.png"}
            name={"Rashaga Taga"}
            class={"Sorcerer 5 | Bard 1"}
            title={"A feline menace"}
            description={
              "After living peacefully in Dagger Falls for 84 years, Rashaga Taga was thrust into the life of an adventurer when his wife, Lelyna, was shockingly murdered. Now on the run from the fiend-hunting Divine Council, he hopes to promote his allies’ growth and eventually seek revenge on the killers."
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
              "In Dagger Falls, Instance Number 2 (or INT) found himself with more freedom than he had known before escaping the Xornic Order. A product of otherworldly experimentation, INT found safety from the Doctors surrounded by his new friends, planning to one day return to that tower he fled from and rescue Instance Number 1."
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
              "Not even having been in Dagger Falls a full month, Nola fled the village and her blacksmithing job as the fiendish presence lurking in the shadows caught the attention of the Divine Council, and she got caught in the middle. On a journey of self-discovery far away from her feywild, Nola intends to wash away past misdeeds on her path of redemption."
            }
            mainAttack={"Divine smite"}
            mainAttackImage={"./logo-edited.png"}
          />
          <Character
            image={"./character.png"}
            name={"Eldawyn"}
            class={"Warlock 6"}
            title={"A dead changling"}
            description={
              "Eldawyn had just gotten to Dagger Falls when Rashaga Taga offered them work. While tending a farm wasn’t what they had in mind when they left Kurai Tayo, perhaps that voice in their head told them it was the best path forward. With their old family and mentor left behind them, Eldawyn (if that is their real name) seeks to uncover the mystery of the scythe they wield, and the Oracle preserved within it."
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
