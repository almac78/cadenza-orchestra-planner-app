/* Helpers for turning stored date ("YYYY-MM-DD") and time ("HH:MM") strings into friendly labels. */

const LOCALE = "en-GB";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Parses a stored date string as a local date at midnight.
function parseLocalDate(date) {
  return new Date(`${date}T00:00`);
}

// Returns the parts needed for the calendar-style date badge, e.g. {day: "01", month: "Jan", weekday: "Fri"}.
export function getDateBadgeParts(date) {
  const d = parseLocalDate(date);
  return {
    day: d.toLocaleString(LOCALE, { day: "2-digit" }),
    month: d.toLocaleString(LOCALE, { month: "short" }),
    weekday: d.toLocaleString(LOCALE, { weekday: "short" }),
  };
}

// e.g. "Friday, 1 January 2026"
export function formatLongDate(date) {
  return parseLocalDate(date).toLocaleDateString(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

//e.g. "November 2026" - used to group events by month on the dashboard.
export function formatMonthHeading(date) {
  return parseLocalDate(date).toLocaleDateString(LOCALE, {
    month: "long",
    year: "numeric",
  });
}
//Returns a short relative label such as "Today", "Tomorrow", "In 8 days" or 3 days ago".
export function formatRelativeDay(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((parseLocalDate(date) - today) / MS_PER_DAY);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffDays === -1) return "Yesterday";
  return `${Math.abs(diffDays)} days ago`;
}

// Groups a sorted list of events into [{ heading, events }] by month.
export function groupEventsByMonth(events) {
  const groups = [];
  events.forEach((event) => {
    const heading = formatMonthHeading(event.date);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.heading === heading) {
      lastGroup.events.push(event);
    } else {
      groups.push({ heading, events: [event] });
    }
  });
  return groups;
}

// Today's date as "YYYY-MM-DD" in local time, used as the minimum for date inputs.
export function todayIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
