import { useEffect, useState } from "react";
import { fetchPosts } from "../services/api";
import "./Analytics.css";

export default function Analytics() {
  const [posts, setPosts] = useState([]);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(Array.isArray(data) ? data : []);
    });
  }, []);

  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
  const totalShares = posts.reduce((sum, post) => sum + (post.shares || 0), 0);

  const platformMetrics = posts.reduce((acc, post) => {
    if (!acc[post.platform]) {
      acc[post.platform] = { count: 0, views: 0, likes: 0, comments: 0, shares: 0 };
    }
    acc[post.platform].count += 1;
    acc[post.platform].views += post.views || 0;
    acc[post.platform].likes += post.likes || 0;
    acc[post.platform].comments += post.comments || 0;
    acc[post.platform].shares += post.shares || 0;
    return acc;
  }, {});

  const typeBreakdown = posts.reduce((acc, post) => {
    const type = post.type || "unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const avgViewsPerPost = posts.length > 0 ? Math.round(totalViews / posts.length) : 0;
  const engagementRate = posts.length > 0 ? Math.round(((totalLikes + totalComments + totalShares) / (totalViews || 1)) * 100 * 100) / 100 : 0;

  const bestPlatform = Object.entries(platformMetrics).sort(
    ([, a], [, b]) => b.views - a.views
  )[0];

  const performanceByDay = posts.reduce((acc, post) => {
    const date = new Date(post.createdAt || Date.now());
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    if (!acc[day]) {
      acc[day] = { views: 0, count: 0, engagement: 0 };
    }
    acc[day].views += post.views || 0;
    acc[day].count += 1;
    acc[day].engagement += (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
    return acc;
  }, {});

  const topHashtags = posts.reduce((acc, post) => {
    const hashtags = (post.content || "").match(/#\w+/g) || [];
    hashtags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const topHashtagsArray = Object.entries(topHashtags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const contentThemes = {
    promotional: posts.filter((p) => (p.content || "").toLowerCase().includes("sale|discount|offer|deal|limited")).length,
    educational: posts.filter((p) => (p.content || "").toLowerCase().includes("learn|guide|tips|how to|tutorial")).length,
    entertaining: posts.filter((p) => (p.content || "").toLowerCase().includes("funny|laugh|smile|fun|enjoy")).length,
    engagement: posts.filter((p) => (p.content || "").toLowerCase().includes("comment|share|tag|question")).length,
  };

  const postingFrequency = posts.length > 0 ? `${Math.round((posts.length / 30))} posts/month` : "No posts";

  const topPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const topPerformingContent = [...posts]
    .filter((p) => p.views > avgViewsPerPost)
    .sort((a, b) => (b.views || 0) - (a.views || 0));

  const engagementByPlatform = Object.entries(platformMetrics).map(
    ([platform, data]) => ({
      platform,
      avgEngagement: data.count > 0 ? Math.round(data.views / data.count) : 0,
      totalViews: data.views,
      posts: data.count,
    })
  );

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>📊 Advanced Analytics</h2>
        <div className="time-range-selector">
          <button
            className={timeRange === "all" ? "active" : ""}
            onClick={() => setTimeRange("all")}
          >
            All Time
          </button>
          <button
            className={timeRange === "month" ? "active" : ""}
            onClick={() => setTimeRange("month")}
          >
            This Month
          </button>
          <button
            className={timeRange === "week" ? "active" : ""}
            onClick={() => setTimeRange("week")}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="analytics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h4>Total Views</h4>
            <p className="metric-value">{totalViews.toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📝</div>
          <div className="metric-content">
            <h4>Published Posts</h4>
            <p className="metric-value">{posts.length}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h4>Avg. Views/Post</h4>
            <p className="metric-value">{avgViewsPerPost}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏆</div>
          <div className="metric-content">
            <h4>Engagement Rate</h4>
            <p className="metric-value">{engagementRate}%</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👍</div>
          <div className="metric-content">
            <h4>Total Engagements</h4>
            <p className="metric-value">{(totalLikes + totalComments + totalShares).toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h4>Posting Frequency</h4>
            <p className="metric-value">{postingFrequency}</p>
          </div>
        </div>
      </div>

      {/* Content Type Breakdown */}
      <div className="analytics-section">
        <h3>📊 Content Type Breakdown</h3>
        <div className="content-types">
          {Object.entries(typeBreakdown).map(([type, count]) => (
            <div key={type} className="type-card">
              <div className="type-icon">
                {type === "post" && "📝"}
                {type === "reel" && "🎬"}
                {type === "youtube" && "📺"}
                {!["post", "reel", "youtube"].includes(type) && "📌"}
              </div>
              <div className="type-info">
                <h4>{type.charAt(0).toUpperCase() + type.slice(1)}s</h4>
                <p>{count} {count === 1 ? "item" : "items"}</p>
              </div>
              <div className="type-percentage">
                {posts.length > 0 && `${Math.round((count / posts.length) * 100)}%`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance by Day of Week */}
      <div className="analytics-section">
        <h3>📅 Performance by Day of Week</h3>
        <div className="performance-by-day">
          {Object.entries(performanceByDay).map(([day, data]) => (
            <div key={day} className="day-card">
              <div className="day-header">
                <h4>{day}</h4>
              </div>
              <div className="day-metrics">
                <div className="day-stat">
                  <span className="day-label">Posts</span>
                  <span className="day-value">{data.count}</span>
                </div>
                <div className="day-stat">
                  <span className="day-label">Avg Views</span>
                  <span className="day-value">{data.count > 0 ? Math.round(data.views / data.count) : 0}</span>
                </div>
                <div className="day-stat">
                  <span className="day-label">Total Engagement</span>
                  <span className="day-value">{data.engagement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Hashtags */}
      {topHashtagsArray.length > 0 && (
        <div className="analytics-section">
          <h3>🏷️ Top Performing Hashtags</h3>
          <div className="hashtags-container">
            {topHashtagsArray.map(([tag, count]) => (
              <div key={tag} className="hashtag-card">
                <span className="hashtag-name">{tag}</span>
                <span className="hashtag-count">{count} posts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Themes */}
      <div className="analytics-section">
        <h3>🎯 Content Themes Distribution</h3>
        <div className="themes-container">
          {Object.entries(contentThemes).map(([theme, count]) => (
            <div key={theme} className="theme-card">
              <div className="theme-icon">
                {theme === "promotional" && "🛍️"}
                {theme === "educational" && "📚"}
                {theme === "entertaining" && "🎭"}
                {theme === "engagement" && "💬"}
              </div>
              <div className="theme-info">
                <h4>{theme.charAt(0).toUpperCase() + theme.slice(1)}</h4>
                <p>{count} posts</p>
              </div>
              <div className="theme-percentage">
                {posts.length > 0 && `${Math.round((count / posts.length) * 100)}%`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Performance */}
      <div className="analytics-section">
        <h3>📱 Platform Performance</h3>
        <div className="platform-performance">
          {engagementByPlatform.map((data) => (
            <div key={data.platform} className="platform-card">
              <div className="platform-header">
                <h4>{data.platform}</h4>
                <span className="post-count">{data.posts} posts</span>
              </div>
              <div className="platform-metrics">
                <div className="metric">
                  <span className="label">Total Views</span>
                  <span className="value">{data.totalViews.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <span className="label">Avg. per Post</span>
                  <span className="value">{data.avgEngagement}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${Math.min(
                      (data.totalViews / Math.max(...engagementByPlatform.map((p) => p.totalViews))) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="analytics-section">
        <h3>🔝 Top 5 Performing Posts</h3>
        <div className="top-posts-list">
          {topPosts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet. Create some content to see analytics!</p>
            </div>
          ) : (
            topPosts.map((post, index) => (
              <div key={post.id} className="top-post-item">
                <div className="rank-badge">{index + 1}</div>
                <div className="post-details">
                  <div className="post-header">
                    <span className="platform-badge">{post.platform}</span>
                    <span className="post-type">{post.type || "post"}</span>
                  </div>
                  <p className="post-content">
                    {post.type === "youtube" ? post.title : post.content?.slice(0, 100)}
                    {(post.type === "youtube" ? post.title : post.content?.slice(0, 100))?.length >= 100 && "..."}
                  </p>
                </div>
                <div className="post-views">{(post.views || 0).toLocaleString()} views</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Above Average Performance */}
      {topPerformingContent.length > 0 && (
        <div className="analytics-section">
          <h3>⚡ Above Average Performers ({topPerformingContent.length})</h3>
          <div className="high-performers">
            {topPerformingContent.slice(0, 3).map((post) => (
              <div key={post.id} className="performer-card">
                <div className="performer-badge">✨ Top Performer</div>
                <p className="performer-content">
                  {post.type === "youtube" ? post.title : post.content?.slice(0, 80)}...
                </p>
                <div className="performer-stats">
                  <span>{post.platform}</span>
                  <span className="performer-views">{((post.views || 0) / avgViewsPerPost).toFixed(1)}x avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights & Recommendations */}
      <div className="analytics-section insights">
        <h3>💡 Insights & Tips</h3>
        <div className="insights-grid">
          {topPerformingContent.length > 0 && (
            <div className="insight">
              <span className="insight-icon">🎯</span>
              <p>
                Your <strong>{topPerformingContent[0].platform}</strong> content performs best! 
                Focus on similar content to boost engagement.
              </p>
            </div>
          )}
          {Object.entries(typeBreakdown).length > 1 && (
            <div className="insight">
              <span className="insight-icon">📊</span>
              <p>
                You're using {Object.entries(typeBreakdown).length} content types. 
                Diversify your content strategy for broader reach!
              </p>
            </div>
          )}
          {avgViewsPerPost > 0 && (
            <div className="insight">
              <span className="insight-icon">📈</span>
              <p>
                Your average post gets <strong>{avgViewsPerPost}</strong> views. 
                Keep posting consistently to grow this number!
              </p>
            </div>
          )}
          <div className="insight">
            <span className="insight-icon">💬</span>
            <p>
              Share your best performing posts more often and analyze what makes them successful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
