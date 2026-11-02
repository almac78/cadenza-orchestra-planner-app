/* Provides the logged-in user's events and event actions to the whole app through the Context API. */
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { EventsContext } from "./EventsContext";
// Import authentication hook to associate events with users.
import { useAuth } from "../hooks/useAuth";
// Utility functions for local storage handling and validation.
import { loadJSON, saveJSON } from "../utils/storage";
import { required, isPastEvent } from "../utils/validators";

// Key for storing events in local storage.
const EVENTS_KEY = "cop_events";
// Fields that make up an event, used to strip any unexpected properties.
const EVENT_FIELDS = ["name", "date", "time", "description", "location"];

//Returns only the known event fields, with surrounding whitespace removed.
function cleanEventData(data) {
  return EVENT_FIELDS.reduce((clean, field) => {
    clean[field] = String(data[field] ?? "").trim();
    return clean;
  }, {});
}

// Validates event data. The "future date" rule can be switched off when editing a call whose date and time have not changed, so past calls can still be updated.
function validateEvent(data, { requireFuture = true } = {}) {
  const errors = {};
  if (!required(data.name)) errors.name = "Engagement title is required.";
  if (!required(data.date)) errors.date = "Engagement date is required.";
  if (!required(data.time)) errors.time = "Call time is required.";
  if (!required(data.description)) errors.description = "Notes are required.";
  if (!required(data.location)) errors.location = "Venue is required.";

  // Ensure the event date and time are in the future.
  if (
    requireFuture &&
    required(data.date) &&
    required(data.time) &&
    isPastEvent(data.date, data.time)
  ) {
    errors.form = "Please choose a date and time in the future.";
    errors.date = "Date/time cannot be in the past.";
    errors.time = "Date/time cannot be in the past.";
  }

  return errors;
}

//Sorts events chronologically by date, then time.
function byDateTime(a, b) {
  return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
}

export function EventsProvider({ children }) {
  // Get current user from authentication context.
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.id ?? null;
  //Load all events from local storage, or initialise with an empty array.
  const [events, setEvents] = useState(() => loadJSON(EVENTS_KEY, []));

  // Save events to local storage whenever they change.
  useEffect(() => {
    saveJSON(EVENTS_KEY, events);
  }, [events]);

  // Only the current user's events, sorted by date and time.
  const userEvents = useMemo(() => {
    return events.filter((e) => e.userId === currentUserId).sort(byDateTime);
  }, [events, currentUserId]);

  // Split the user's events into upcoming and past events for the dashboard.
  const upcomingEvents = useMemo(
    () => userEvents.filter((e) => !isPastEvent(e.date, e.time)),
    [userEvents],
  );
  const pastEvents = useMemo(
    () => userEvents.filter((e) => isPastEvent(e.date, e.time)).reverse(),
    [userEvents],
  );

  // Find one of the current user's events by id (returns null for other users' events).
  const getEventById = useCallback(
    (eventId) => userEvents.find((e) => e.id === eventId) ?? null,
    [userEvents],
  );

  //Add a new event for the current user.
  const addEvent = useCallback(
    (data) => {
      if (!currentUserId)
        return {
          ok: false,
          errors: { form: "You must be logged in to add an engagement." },
        };

      const clean = cleanEventData(data);
      const errors = validateEvent(clean);
      if (Object.keys(errors).length > 0) return { ok: false, errors };

      const newEvent = {
        id: uuidv4(),
        userId: currentUserId,
        ...clean,
      };
      setEvents((prev) => [...prev, newEvent]);
      return { ok: true };
    },
    [currentUserId],
  );

  // Update an existing event that belongs to the current user.
  const updateEvent = useCallback(
    (eventId, data) => {
      const existing = getEventById(eventId);
      if (!existing)
        return { ok: false, errors: { form: "This call could not be found." } };
      const clean = cleanEventData(data);
      // Only insist on a future date if the date or time has been changed.
      const dateChanged =
        clean.date !== existing.date || clean.time !== existing.time;
      const errors = validateEvent(clean, { requireFuture: dateChanged });
      if (Object.keys(errors).length > 0) return { ok: false, errors };

      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...existing, ...clean } : e)),
      );
      return { ok: true };
    },
    [getEventById],
  );

  // Delete an event that belongs to the current user.
  const deleteEvent = useCallback(
    (eventId) => {
      setEvents((prev) =>
        prev.filter((e) => !(e.id === eventId && e.userId === currentUserId)),
      );
    },
    [currentUserId],
  );

  // Memoise the context value so consumers only re-render when something changes.
  const value = useMemo(
    () => ({
      userEvents,
      upcomingEvents,
      pastEvents,
      getEventById,
      addEvent,
      updateEvent,
      deleteEvent,
    }),
    [
      userEvents,
      upcomingEvents,
      pastEvents,
      getEventById,
      addEvent,
      updateEvent,
      deleteEvent,
    ],
  );
  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}
