/* Validates whether a string is an email address. */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
/* Validates that a value is not an empty space or white space.*/
export function required(value) {
  return value != null && String(value).trim().length > 0;
}
/* Checks whether an event's date and time have already passed.*/
export function isPastEvent(date, time) {
  if (!date || !time) return false;

  const eventDateTime = new Date(`${date}T${time}`);
  if (Number.isNaN(eventDateTime.getTime())) return false;

  const now = new Date();
  // Buffer to avoid failing "now" due to milliseconds differences between the event and the current time.
  now.setMinutes(now.getMinutes() - 1);
  return eventDateTime < now;
}
