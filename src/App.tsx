import { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";

import { SessionProvider } from "./auth/Session";

import NavbarComponent from "./components/navbar/NavbarComponent";

import HomePage from "./pages/HomePage";
import CharactersPage from "./pages/CharactersPage";
import CharacterPage from "./pages/CharacterPage";
import MapPage from "./pages/MapPage";
import CalendarPage from "./pages/CalendarPage";
import EventsPage from "./pages/EventsPage";
import EventPage from "./pages/EventPage";
import DashboardPage from "./pages/DashboardPage";
import CreateEventEditorPage from "./pages/CreateEventEditorPage";
import UpdateEventEditorPage from "./pages/UpdateEventEditorPage";
import CreateCharacterEditorPage from "./pages/CreateCharacterEditorPage";
import UpdateCharacterEditorPage from "./pages/UpdateCharacterEditorPage";
import UpdateUserEditorPage from "./pages/UpdateUserEditorPage";
import BattlemapPage from "./pages/BattlemapPage";

const App: Component = () => {
  return (
    <>
      <SessionProvider>
        <Router>
          <NavbarComponent />
          <Routes>
            <Route path="/" component={HomePage} />
            <Route path="/characters" component={CharactersPage} />
            <Route path="/characters/:id" component={CharacterPage} />
            <Route path="/map" component={MapPage} />
            <Route path="/calendar" component={CalendarPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/events/:id" component={EventPage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/event-editor" component={CreateEventEditorPage} />
            <Route path="/event-editor/:id" component={UpdateEventEditorPage} />
            <Route
              path="/character-editor"
              component={CreateCharacterEditorPage}
            />
            <Route
              path="/character-editor/:id"
              component={UpdateCharacterEditorPage}
            />
            <Route path="/user-editor/:id" component={UpdateUserEditorPage} />
            <Route path="/combat" component={BattlemapPage} />
          </Routes>
        </Router>
      </SessionProvider>
    </>
  );
};

export default App;
