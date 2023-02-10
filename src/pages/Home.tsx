import type { Component } from "solid-js";

const Home: Component = () => {
  return (
    <>
      <div class="flex flex-col gap-6 min-h-screen bg-background text-text pt-20 ">
        <div class="flex justify-between">
          <div class="flex flex-col gap-4 p-8 border-b-2">
            <div class="text-7xl">In Memoriam: Noc</div>
            <div class="flex items-center gap-8">
              <button class="w-96 h-10 bg-yellow text-center rounded-full hover:bg-red">
                Read more!
              </button>
              <div class="text-xl">
                This is where a small description goes. This is where a small
                description goes. This is where a small description goes. This
                is where a small description goes. This is where a small
                description goes. This is where a small description goes. This
                is where a small description goes. This is where a small
                description goes. This is where a small description goes.
              </div>
            </div>
            <div class="text-xl">
              This is where part of the article is shown. This is where part of
              the article is shown. This is where part of the article is shown.
              This is where part of the article is shown. This is where part of
              the article is shown. This is where part of the article is shown.
              This is where part of the article is shown. This is where part of
              the article is shown. This is where part of the article is shown.
              This is where part of the article is shown. This is where part of
              the article is shown. This is where part of the article is shown.
              This is where part of the article is shown. This is where part of
              the article is shown.
            </div>
          </div>
          <img src="./template.png" alt="Article image" />
        </div>
        <div class="flex justify-between">
          <div class="flex flex-col gap-4 p-8 border-b-2">
            <div class="text-7xl">Flee</div>
            <div class="flex items-center gap-8">
              <div class="text-xl">
                Situated on the tri-border of the Zushal, Orandi, and Cyroquil
                Kingdoms, Dagger Falls was thought to be diplomatically immune
                to the affairs of the surrounding kingdoms. Now, the Divine
                Council, on a fiend-cleansing crusade, has invaded the small
                village, forcing our adventurers… to Flee.
              </div>
            </div>
            <div class="text-xl">
              Flee is a DnD 5e campaign DMed by Jo Evangelista, and played by
              Connar Williams, Tyler Riley, Emma Sunderman, and Brennan Ober.
            </div>
          </div>
          <img src="./wanderingarmsnobg.png" alt="Article image" />
        </div>
      </div>
    </>
  );
};

export default Home;
