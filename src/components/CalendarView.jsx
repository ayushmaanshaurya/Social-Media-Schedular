import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CalendarView.css";

export default function CalendarView({ posts }) {
  const navigate = useNavigate();
  const today = new Date();
  
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const postsByDate = posts.reduce((acc, post) => {
    if (!post.date) return acc;
    const key = post.date.split("T")[0];
    acc[key] = acc[key] ? [...acc[key], post] : [post];
    return acc;
  }, {});

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const getPlatformColor = (platform) => {
    const colors = {
      "Twitter": { bg: "#1DA1F2", text: "white" },
      "LinkedIn": { bg: "#0077B5", text: "white" },
      "Instagram": { bg: "#E4405F", text: "white" },
      "YouTube": { bg: "#FF0000", text: "white" },
      "Facebook": { bg: "#1877F2", text: "white" },
      "TikTok": { bg: "#000000", text: "white" },
      "Instagram Reels": { bg: "#E4405F", text: "white" },
      "YouTube Shorts": { bg: "#FF0000", text: "white" },
    };
    return colors[platform] || { bg: "#6366f1", text: "white" };
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h3>📅 Schedule Calendar</h3>
        <div className="calendar-controls">
          <button className="cal-btn" onClick={handlePrevMonth}>←</button>
          <h4 className="month-year">{monthNames[month]} {year}</h4>
          <button className="cal-btn" onClick={handleNextMonth}>→</button>
          <button className="cal-btn today-btn" onClick={handleToday}>Today</button>
        </div>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="calendar-head">
            {d}
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          if (!day) return <div key={idx} className="calendar-cell empty" />;

          const dateKey = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const dayPosts = postsByDate[dateKey] || [];

          return (
            <div
              key={idx}
              className={`calendar-cell ${isToday ? "today" : ""} ${dayPosts.length > 0 ? "has-posts" : ""}`}
              onClick={() =>
                navigate("/create", {
                  state: { presetDate: `${dateKey}T09:00` },
                })
              }
            >
              <span className={`day-number ${isToday ? "today-number" : ""}`}>
                {day}
              </span>

              <div className="posts-container">
                {dayPosts.map((post, i) => {
                  const color = getPlatformColor(post.platform);
                  return (
                    <div
                      key={i}
                      className="calendar-post"
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                      }}
                      title={post.platform}
                    >
                      {post.platform.split(" ")[0]}
                    </div>
                  );
                })}
              </div>

              {dayPosts.length > 2 && (
                <div className="post-count">
                  +{dayPosts.length - 2} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
