import type { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";

import Home from "./pages/Home";
import Characters from "./pages/Characters";
import Map from "./pages/Map";
import Calendar from "./pages/Calendar";
import Navbar from "./components/Navbar";

const App: Component = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/map" element={<Map />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
