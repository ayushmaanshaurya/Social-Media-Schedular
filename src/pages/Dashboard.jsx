import { useEffect, useState } from "react";
import {
  fetchPosts,
  deletePost,
  incrementViews,
} from "../services/api";
import PostCard from "../components/Postcard";
import CalendarView from "../components/CalendarView";
import StatsCards from "../components/StatsCards";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const data = await fetchPosts();
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((post) => post.id !== id));
    toast.error("Post deleted");
  };

  const handleView = async (id) => {
    await incrementViews(id);
    const data = await fetchPosts();
    setPosts(Array.isArray(data) ? data : []);
  };

  const filteredPosts = Array.isArray(posts)
    ? posts
        .filter((p) => {
          const searchText = p.type === "youtube" ? p.title : p.content;
          return searchText?.toLowerCase().includes(search.toLowerCase());
        })
        .filter((p) =>
          filter === "All" ? true : p.platform === filter
        )
    : [];

  const totalImpressions = filteredPosts.reduce(
    (sum, post) => sum + (post.views || 0),
    0
  );

  if (loading) {
    return <div style={{ padding: 40 }}>Loading posts...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <StatsCards totalImpressions={totalImpressions} />

        <CalendarView
          posts={posts.filter((p) => p.status !== "Draft")}
        />

        <div className="page-header">
          <h2 className="page-title">Scheduled Posts</h2>

          <div className="filters center-filters">
            <input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Twitter</option>
              <option>LinkedIn</option>
              <option>Instagram</option>
              <option>YouTube</option>
              <option>Facebook</option>
              <option>TikTok</option>
            </select>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts scheduled</h3>
            <button onClick={() => navigate("/create")}>
              + Create Post
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={() => handleDelete(post.id)}
              onEdit={() => navigate(`/edit/${post.id}`)}
              onView={() => handleView(post.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
