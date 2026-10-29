/* Reads data from local storage and converts it from a JSON string back to a real JavaScript object. Returns the fallback if nothing is stored or the stored value cannot be read. */
export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/* Converts a value to JSON string and saves it in localStorage. Fails silently (e.g. in private browsing mode when storage is full or blocked) so that the app keeps working in memory. */
export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable - state is still held in React for this session.
  }
}
