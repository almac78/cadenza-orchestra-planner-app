/* Provides user accounts and login state to the whole app through the context API. */
import { useCallback, useMemo, useState } from "react";
import {v4 as uuidv4} from "uuid";
import { AuthContext } from "./AuthContext";
// Utility function for validation and local storage handling.
import {isValidEmail, required} from "../utils/validators";
import { loadJSON, saveJSON } from "../utils/storage";

// Keys for local storage.
const USERS_KEY = "cop_users";
const CURRENT_USER_KEY = "cop_current_user";
// Minimum password length for new accounts.
const MIN_PASSWORD_LENGTH = 6;

// Returns a copy of the user record without the password, safe to keep in state.
function toPublicUser(user) {
    return { 
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        };
    }

    export function AuthProvider({ children }) {
        // Load saved users from local storage or initialise with an empty array.
        const [users, setUsers] = useState(() => loadJSON(USERS_KEY, []));
        // Load the currently logged-in user from local storage or initialise with null.
        const [currentUser, setCurrentUser] = useState(() => 
            loadJSON(CURRENT_USER_KEY, null));

        // Save current user to state and local storage to simulate a login session.
        const persistCurrentUser = useCallback((user) => {
            setCurrentUser(user);
            saveJSON(CURRENT_USER_KEY, user);
        }, []);

        //Register a new account with validation checks.
        const register = useCallback(
            ({name, email, username, password}) => {
            const errors = {};
            const trimmedEmail = String(email).trim();
            const trimmedUsername = String(username).trim();
            
            if (!required(name)) errors.name = "Name is required";

            if (!required(trimmedEmail)) errors.email = "Email is required.";
            else if (!isValidEmail(trimmedEmail))
                errors.email = "Please enter a valid email address, e.g. name@example.com";
            else if (
                users.some((u) => u.email.toLowerCase() === trimmedEmail.toLocaleLowerCase())
                )
                errors.email = "An account with this email already exists";

                if(!required(trimmedUsername)) errors.username = "Username is required.";
                else if (/\s/.test(trimmedUsername)) errors.username = "Username cannot contain spaces.";
                else if (
                    users.some((u) => u.username.toLowerCase() === trimmedUsername.toLowerCase())
                    )
                    errors.username = "An account with this username already exists.";

                    if (!required(password)) errors.password = "Password is required.";
                    else if (String(password).length < MIN_PASSWORD_LENGTH)
                        errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;

                    //Return errors if any validation checks fail.
                    if (Object.keys(errors).length > 0)
                        return { ok: false, errors };

                        //Create the new user and persist the updated list of users to local storage.
                        const newUser = {
                            id: uuidv4(),
                            name: name.trim(),
                            email: trimmedEmail,
                            username: trimmedUsername,
                            password
                        };
                        const nextUsers = [...users, newUser];
                            setUsers(nextUsers);
                            saveJSON(USERS_KEY, nextUsers);

                            //Log in the new user automatically after registration.
                            persistCurrentUser(toPublicUser(newUser));
                            return { ok: true};
                        },
                        [users, persistCurrentUser]
                    );
        
                    //Log in an existing user with either username or email.
                    const login = useCallback(({ usernameOrEmail, password }) => {
                        const errors = {};
                    if (!required(usernameOrEmail)) errors.usernameOrEmail = "Username or email is required.";
                    if (!required(password)) errors.password = "Password is required.";
                    if (Object.keys(errors).length > 0) {
                        return { ok: false, errors };
                    }

                    // Find matching user record by username or email.
                    const identifier = usernameOrEmail.trim().toLowerCase();
                    const found = users.find(
                        (u) =>
                        u.username.toLowerCase() === identifier ||
                        u.email.toLowerCase() === identifier
                    );

                    //Use on generic message so the form doesn not reveal which part was wrong.
                    if (!found || found.password !== password) {
                        return { ok: false, errors: { form: "Incorrect username/email or password." },
                     };
                    }
                    persistCurrentUser(toPublicUser(found));
                    return { ok: true };
                },
                [users, persistCurrentUser]
            );

            // Clear the current user to simulate logging out.
            const logout = useCallback(() => {
                persistCurrentUser(null);
            }, [persistCurrentUser]);
            
            // Memoize the context value so consumers only re-render when something changes.
            const value = useMemo(
                () => ({
                    currentUser,
                    isLoggedIn: Boolean(currentUser),
                    register,
                    login,
                    logout,
                }),
                [currentUser, register, login, logout]
            );
            
            return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
        }