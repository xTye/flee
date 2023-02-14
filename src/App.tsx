import { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";

import { SessionProvider } from "./auth/Session";

import Navbar from "./components/navbar/Navbar";

import Home from "./pages/Home";
import Characters from "./pages/Characters";
import Map from "./pages/Map";
import Calendar from "./pages/Calendar";
import Events from "./pages/Events";
import Event from "./pages/Event";
import Dashboard from "./pages/Dashboard";
import CreateEventEditor from "./pages/CreateEventEditor";
import UpdateEventEditor from "./pages/UpdateEventEditor";

const App: Component = () => {
  return (
    <>
      <SessionProvider>
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
            <Route path="/event-editor" element={<CreateEventEditor />} />
            <Route path="/event-editor/:id" element={<UpdateEventEditor />} />
          </Routes>
        </Router>
      </SessionProvider>
    </>
  );
};

export default App;
