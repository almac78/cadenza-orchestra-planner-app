import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
//Custom application styling (loaded after Bootstrap so it can override Bootstrap styles)
import "./styles/app.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
