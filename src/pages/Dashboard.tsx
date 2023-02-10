import { Component, onMount, createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { navbarHeight } from "../components/Navbar";

const Dashboard: Component = () => {
  let docsDiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;

  createMemo(() => {
    docsDiv.style.height = window.innerHeight - navbarHeight.height + "px";
  });

  onMount(() => {
    const navigate = useNavigate();

    // TODO: Add a check to see if the user is logged in
    //navigate("/", { replace: true });
  });

  return (
    <>
      <div ref={docsDiv} class="h-screen">
        <iframe
          class="w-full h-full"
          src="https://docs.google.com/document/d/1uWklHax7C7BIgkzBYWZw-9Mv56K0Nphkg72SSM6Maj8/edit?usp=sharing"
        ></iframe>
      </div>
    </>
  );
};

export default Dashboard;
