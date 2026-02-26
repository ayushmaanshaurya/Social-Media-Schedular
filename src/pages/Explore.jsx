import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Explore.css";

export default function Explore() {
  const navigate = useNavigate();
  const [selectedReel, setSelectedReel] = useState(null);

  const trendingReels = [
    { 
      id: 1,
      title: "Morning routine reel", 
      views: "120K", 
      platform: "Instagram",
      duration: "0:45",
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%)",
      emoji: "⏰"
    },
    { 
      id: 2,
      title: "Before & After transformation", 
      views: "98K", 
      platform: "Instagram",
      duration: "1:23",
      gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
      emoji: "✨"
    },
    { 
      id: 3,
      title: "Day in my life", 
      views: "210K", 
      platform: "TikTok",
      duration: "0:58",
      gradient: "linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)",
      emoji: "🌅"
    },
    { 
      id: 4,
      title: "Fitness motivation short", 
      views: "156K", 
      platform: "YouTube Shorts",
      duration: "0:30",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      emoji: "💪"
    },
    { 
      id: 5,
      title: "Cooking quick recipe", 
      views: "89K", 
      platform: "Instagram Reels",
      duration: "1:15",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      emoji: "👨‍🍳"
    },
  ];

  const trendingYoutube = [
    { title: "How to grow YouTube channel", views: "450K", duration: "12:34" },
    { title: "Top 10 content creator tips", views: "320K", duration: "18:45" },
    { title: "Monetization strategies 2026", views: "280K", duration: "9:12" },
  ];

  const trendingPosts = [
    "5 productivity hacks you should try 🚀",
    "Consistency beats motivation 💡",
    "How I grew my audience in 30 days 📈",
    "Instagram algorithm secrets 🤐",
    "YouTube SEO best practices 🎯",
  ];

  const hashtags = [
    "#contentcreator",
    "#socialmediamarketing",
    "#reelsinstagram",
    "#buildinpublic",
    "#creatoreconomy",
    "#youtubeshorts",
    "#instagramreels",
    "#tiktoktrends",
  ];

  return (
    <div className="explore-page">
      <h2>🔍 Explore Trending Content</h2>

      <section>
        <h3>🎬 Trending Reels & Shorts</h3>
        <div className="reel-explore-grid">
          {trendingReels.map((reel) => (
            <div 
              className="explore-reel-card" 
              key={reel.id}
              onClick={() => setSelectedReel(reel)}
              role="button"
              tabIndex={0}
            >
              <div className="reel-placeholder" style={{ background: reel.gradient }}>
                <span className="reel-emoji">{reel.emoji}</span>
                <span className="play-button">▶</span>
                <span className="duration-badge">{reel.duration}</span>
              </div>
              <div className="reel-info">
                <h4>{reel.title}</h4>
                <p className="views">{reel.views} views</p>
                <span className="platform-badge">{reel.platform}</span>
                <button 
                  className="use-reel-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/create", {
                      state: { caption: reel.title },
                    });
                  }}
                >
                  Use This Idea
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedReel && (
        <div className="reel-preview-modal" onClick={() => setSelectedReel(null)}>
          <div className="reel-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-preview" onClick={() => setSelectedReel(null)}>✕</button>
            <div className="preview-video" style={{ background: selectedReel.gradient }}>
              <div className="video-placeholder">
                <span className="large-emoji">{selectedReel.emoji}</span>
                <span className="large-play">▶</span>
              </div>
            </div>
            <div className="preview-details">
              <h3>{selectedReel.title}</h3>
              <p className="preview-views">{selectedReel.views} views</p>
              <p className="preview-platform">{selectedReel.platform}</p>
              <div className="preview-actions">
                <button 
                  className="use-idea-btn"
                  onClick={() => {
                    navigate("/create", {
                      state: { caption: selectedReel.title },
                    });
                  }}
                >
                  Use This Caption
                </button>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedReel(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section>
        <h3>📺 Trending YouTube Videos</h3>
        <div className="youtube-grid">
          {trendingYoutube.map((video, index) => (
            <div className="youtube-card" key={index}>
              <div className="youtube-thumbnail">
                <span className="duration">{video.duration}</span>
              </div>
              <div className="yt-info">
                <h4>{video.title}</h4>
                <p>{video.views} views</p>
                <button
                  className="use-btn"
                  onClick={() =>
                    navigate("/create", {
                      state: { caption: video.title },
                    })
                  }
                >
                  Create Similar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>📝 Trending Post Ideas</h3>
        <div className="post-ideas">
          {trendingPosts.map((post, index) => (
            <div className="idea-card" key={index}>
              <p>{post}</p>
              <button
                onClick={() =>
                  navigate("/create", {
                    state: { caption: post },
                  })
                }
                className="idea-use-btn"
              >
                Use
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>#️⃣ Popular Hashtags</h3>
        <div className="hashtags">
          {hashtags.map((tag, index) => (
            <span key={index} className="hashtag-chip">{tag}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
