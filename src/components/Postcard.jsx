import { useAuth } from "../context/AuthContext";
import PlatformBadge from "./PlatformBadge";
import "./Postcard.css";

export default function PostCard({ post, onDelete, onEdit, onView }) {
  const { user } = useAuth();

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "—";

  const displayText = post.type === "youtube" ? post.title : post.content;

  return (
    <div className="post-card" onClick={onView}>
      {post.image && (
        <img src={post.image} alt="Post" className="post-image" />
      )}

      <p className="content">{displayText}</p>

      {post.type === "youtube" && post.description && (
        <p className="description">{post.description.substring(0, 100)}...</p>
      )}

      <div className="meta">
        <PlatformBadge platform={post.platform} />
        <span className={`status ${post.status?.toLowerCase() || ""}`}>
          {post.status}
        </span>
      </div>

      <small className="date">{formattedDate}</small>

      <small style={{ color: "var(--text)", opacity: 0.7 }}>
        👀 Shown {post.views || 0} times
      </small>

      <div className="actions">
        <button
          className="edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          ✏️ Edit
        </button>

        {/* ADMIN ONLY */}
        {user?.role === "admin" && (
          <button
            className="delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
}
