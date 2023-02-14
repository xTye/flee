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
            <Route path="/" component={Home} />
            <Route path="/characters" component={Characters} />
            <Route path="/map" component={Map} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/events" component={Events} />
            <Route path="/events/:id" component={Event} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/event-editor" component={CreateEventEditor} />
            <Route path="/event-editor/:id" component={UpdateEventEditor} />
          </Routes>
        </Router>
      </SessionProvider>
    </>
  );
};

export default App;
