import type { Component } from "solid-js";

import Character from "../components/Character";

const Characters: Component = () => {
  return (
    <>
      <div class="min-h-screen bg-background text-text text-justify pt-10">
        <div class="pl-8 text-7xl">The Wandering Eyes</div>
        <div class="flex justify-between">
          <Character
            image={"/rashaga.PNG"}
            name={"Rashaga Taga"}
            class={"Sorcerer 5 | Bard 1"}
            title={"A bardic sorcerer"}
            description={
              "After living peacefully in Dagger Falls for 84 years, Rashaga Taga was thrust into the life of an adventurer when his wife, Lelyna, was shockingly murdered. Now on the run from the fiend-hunting Divine Council, he hopes to promote his allies’ growth and eventually seek revenge on the killers."
            }
            mainAttack={"Twin spell haste"}
            mainAttackImage={"/logo-edited.png"}
          />
          <Character
            image={"/instance.PNG"}
            name={"Instance Number 2"}
            class={"Psion 5 | Wizard 1"}
            title={"A aether mage"}
            description={
              "In Dagger Falls, Instance Number 2 (or INT) found himself with more freedom than he had known before escaping the Xornic Order. A product of otherworldly experimentation, INT found safety from the Doctors surrounded by his new friends, planning to one day return to that tower he fled from and rescue Instance Number 1."
            }
            mainAttack={"Phase rift into phase shot, for a transpostion bolt"}
            mainAttackImage={"/logo-edited.png"}
          />
          <Character
            image={"/nola.png"}
            name={"Nola"}
            class={"Paladin 6"}
            title={"A fey wanderer"}
            description={
              "Not even having been in Dagger Falls a full month, Nola fled the village and her blacksmithing job as the fiendish presence lurking in the shadows caught the attention of the Divine Council, and she got caught in the middle. On a journey of self-discovery far away from her feywild, Nola intends to wash away past misdeeds on her path of redemption."
            }
            mainAttack={"Darkhand divine smite"}
            mainAttackImage={"/logo-edited.png"}
          />
          <Character
            image={"/ravyn.PNG"}
            name={"Ravyn"}
            class={"Occultist 5 | Cleric 1"}
            title={"A oracle of death"}
            description={
              "As the newest inductee to the Wandering Eyes' network of allies, not much is known of Ravyn's background or motivations. Her first encounter with the party was as a guest at the Infernal Reckoning's guild hall, after which she aided in the defense of The Measured's flotilla without hesitation. Ravyn and her owl companion Darwa form a duo whose links to the world are yet to be uncovered."
            }
            mainAttack={"Hexblades curse multiattack"}
            mainAttackImage={"/logo-edited.png"}
          />
        </div>
        <div class="pl-8 text-7xl">Former Members</div>
        <div class="flex justify-between">
          <Character
            image={"/eldawyn.PNG"}
            name={"Noc (Deceased)"}
            class={"Warlock 6"}
            title={"A oracle of death"}
            description={
              "Eldawyn had just gotten to Dagger Falls when Rashaga Taga offered them work. While tending a farm wasn’t what they had in mind when they left Kurai Tayo, perhaps that voice in their head told them it was the best path forward. With their old family and mentor left behind them, Eldawyn (if that is their real name) seeks to uncover the mystery of the scythe they wield, and the Oracle preserved within it."
            }
            mainAttack={"Being dead"}
            mainAttackImage={"/logo-edited.png"}
          />
          <Character
            image={"/takari.png"}
            name={"Takari Eversoar"}
            class={"Bard"}
            title={"A jokey journalist"}
            description={
              "An Estoria local, Takari got tangled up in The Wandering Eyes' misadventures when she followed the party to the lair of the Ancient Golden Dragon, Izyldriss. After helping the group take down the night hag controlling the dam and poisoning the children of Estoria, Takari published her article on The Wandering Eyes in the newspaper. "
            }
            mainAttack={"Puns"}
            mainAttackImage={"/logo-edited.png"}
          />
          <Character
            image={"/scarlett.png"}
            name={"Scarlett von Brand"}
            class={"Druid"}
            title={"A firey beast"}
            description={
              "Following her father's death in the escape from Dagger Falls, Scarlett struggled to manage her powers - and temper. In a fiery eruption, she was manipulated into hurting the people around her, and decided departing from the group was safest for everyone. Whereabouts unknown, Scarlett may be exploring her familial history to better understand her abilities."
            }
            mainAttack={"Wild shape"}
            mainAttackImage={"/logo-edited.png"}
          />
        </div>
      </div>
    </>
  );
};

export default Characters;
