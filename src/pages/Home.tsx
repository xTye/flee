import type { Component } from "solid-js";
import Navbar from "../components/Navbar";

const Home: Component = () => {
  return (
    <>
      <div class="min-h-screen bg-background text-text pt-20">
        <div class="flex justify-between">
          <div class="flex flex-col gap-4 p-8 border-b-2">
            <div class="text-9xl">The Wandering Eyes</div>
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
      </div>
    </>
  );
};

export default Home;
