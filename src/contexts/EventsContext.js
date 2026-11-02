/* Events context object.
Kept in its own file so that the provider file only exports a component (required for Vite fast refresh to work). */
import { createContext } from "react";

export const EventsContext = createContext(null);