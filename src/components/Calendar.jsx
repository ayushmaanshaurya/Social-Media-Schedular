import "./Calendar.css";

export default function Calendar({ date, setDate }) {
  return (
    <div className="calendar-input-wrapper">
      <label htmlFor="date-input" className="calendar-label">
        📅 Schedule Date & Time
      </label>
      <input
        id="date-input"
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="calendar-input"
      />
    </div>
  );
}