import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { Router, Routes, Route } from "@solidjs/router";

import Home from "./pages/Home";
import Characters from "./pages/Characters";
import Map from "./pages/Map";
import Calendar from "./pages/Calendar";
import Navbar from "./components/Navbar";
import Events from "./pages/Events";
import Event from "./pages/Event";
import Dashboard from "./pages/Dashboard";

const App: Component = () => {
  //const [store, { pullUser }] = useStore();

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/map" element={<Map />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Event />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
