/* Authentication context object
Kept in its own file so that the provider file only exports a component (required for Vite fast refresh). */
import { createContext } from "react";

export const AuthContext = createContext(null);