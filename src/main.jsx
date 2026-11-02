import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
//Custom application styling (loaded after Bootstrap so it can override Bootstrap styles)
import "./styles/app.css";

import App from "./App";
// Context provider: makes login state available to every component inside it.
import {AuthProvider} from "./contexts/AuthProvider.jsx";

// Render the app inside the AuthProvider so that login state is available to all components.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
