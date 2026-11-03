/* Temporary dashboard: a simple list to test adding and editing calls.
The real dashboard is added in the next step. */
import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";

export default function Dashboard() {
  const { userEvents } = useEvents();

  return (
    <>
      <h2>Dashboard</h2>
      <ul>
        {userEvents.map((event) => (
          <li key={event.id}>
            {event.date} {event.time} – {event.name} at {event.location} (
            <Link to={`/edit/${event.id}`}>edit</Link>)
          </li>
        ))}
      </ul>
    </>
  );
}
