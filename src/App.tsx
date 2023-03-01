import { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";

import { SessionProvider } from "./auth/Session";

import NavbarComponent from "./components/navbar/NavbarComponent";

import HomePage from "./pages/HomePage";
import CharactersPage from "./pages/CharactersPage";
import MapPage from "./pages/MapPage";
import CalendarPage from "./pages/CalendarPage";
import EventsPage from "./pages/EventsPage";
import EventPage from "./pages/EventPage";
import DashboardPage from "./pages/DashboardPage";
import CreateEventEditorPage from "./pages/CreateEventEditorPage";
import UpdateEventEditorPage from "./pages/UpdateEventEditorPage";

const App: Component = () => {
  return (
    <>
      <SessionProvider>
        <Router>
          <NavbarComponent />
          <Routes>
            <Route path="/" component={HomePage} />
            <Route path="/characters" component={CharactersPage} />
            <Route path="/map" component={MapPage} />
            <Route path="/calendar" component={CalendarPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/events/:id" component={EventPage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/event-editor" component={CreateEventEditorPage} />
            <Route path="/event-editor/:id" component={UpdateEventEditorPage} />
          </Routes>
        </Router>
      </SessionProvider>
    </>
  );
};

export default App;
