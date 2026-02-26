import { useEffect, useState } from "react";
import { fetchPosts } from "../services/api";
import "./StatsCard.css";

export default function StatsCards() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      }
    };

    loadPosts();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const scheduledCount = posts.filter(
    (p) => p.status === "Upcoming"
  ).length;

  const publishedTodayCount = posts.filter(
    (p) =>
      p.status === "Published" &&
      (p.date || p.createdAt)?.startsWith(today)
  ).length;

  const pendingCount = posts.filter(
    (p) => p.status === "Pending"
  ).length;

  const totalViews = posts.reduce(
    (sum, p) => sum + (p.views || 0),
    0
  );

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h4>Scheduled</h4>
        <p>{scheduledCount} posts</p>
      </div>

      <div className="stat-card">
        <h4>Published Today</h4>
        <p>{publishedTodayCount} posts</p>
      </div>

      <div className="stat-card">
        <h4>Pending Approval</h4>
        <p>{pendingCount} posts</p>
      </div>

      <div className="stat-card">
        <h4>Total Views</h4>
        <p>{totalViews}</p>
      </div>
    </div>
  );
}
