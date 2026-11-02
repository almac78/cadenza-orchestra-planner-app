import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
//Custom application styling (loaded after Bootstrap so it can override Bootstrap styles)
import "./styles/app.css";

import App from "./App";
// Context providers: authentication must wrap events, because events belong to the logged-in user.
import { AuthProvider } from "./contexts/AuthProvider";
import { EventsProvider } from "./contexts/EventsProvider";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EventsProvider>
        <App />
      </EventsProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
