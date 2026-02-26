import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { savePost } from "../services/api";
import PostPreview from "../components/PostPreview";
import AICaptionModal from "../components/AICaptionModal";
import TextToImageModal from "../components/TextToImageModal";
import AvatarGenerator from "../components/AvatarGenerator";
import toast from "react-hot-toast";
import "./CreatePost.css";

const AI_API = "http://localhost:5000/ai/caption";

const PLATFORM_LIMITS = {
  Twitter: 280,
  LinkedIn: 3000,
  Instagram: 2200,
  Facebook: 63206,
  YouTube: 5000,
};

const BEST_POSTING_TIMES = {
  Twitter: "Tue-Thu, 8-10 AM",
  LinkedIn: "Tue-Wed, 8 AM or 5 PM",
  Instagram: "Mon-Fri, 11 AM or 6 PM",
  Facebook: "Wed, 12 PM or 1 PM",
  YouTube: "Thu, 5 PM or Fri, 2 PM",
};

export default function CreatePost() {
  const [activeTab, setActiveTab] = useState("post");

  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("Twitter");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [tone, setTone] = useState("casual");
  const [hashtags, setHashtags] = useState("");

  const [reelCaption, setReelCaption] = useState("");
  const [reelPlatform, setReelPlatform] = useState("Instagram");
  const [reelDate, setReelDate] = useState("");
  const [reelVideo, setReelVideo] = useState(null);

  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeDescription, setYoutubeDescription] = useState("");
  const [youtubeTag, setYoutubeTag] = useState("");
  const [youtubeVideo, setYoutubeVideo] = useState(null);
  const [youtubeDate, setYoutubeDate] = useState("");
  const [youtubeVideoPreview, setYoutubeVideoPreview] = useState(null);
  const reelVideoRef = useRef(null);
  const youtubeVideoRef = useRef(null);
  const [reelVideoError, setReelVideoError] = useState("");
  const [youtubeVideoError, setYoutubeVideoError] = useState("");

  const [reelVideoPreview, setReelVideoPreview] = useState(null);

  const [showAI, setShowAI] = useState(false);
  const [aiTarget, setAiTarget] = useState("post");
  const [aiLoading, setAiLoading] = useState(false);

  const [showTextToImage, setShowTextToImage] = useState(false);
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const getCharLimit = () => PLATFORM_LIMITS[platform] || 280;
  const getCharRemaining = () => getCharLimit() - content.length;
  const getWordCount = () => content.trim() ? content.trim().split(/\s+/).length : 0;
  const isCharLimitExceeded = () => content.length > getCharLimit();

  const generateHashtagSuggestions = () => {
    const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const suggestions = [...new Set(words)].slice(0, 5).map(w => `#${w.replace(/[^a-z0-9]/g, '')}`);
    setHashtags(suggestions.join(" "));
    toast.success("Hashtags generated! ✨");
  };

  const copyToClipboard = () => {
    const textToCopy = content + (hashtags ? " " + hashtags : "");
    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard! 📋");
  };

  useEffect(() => {
    if (autoSave && content && activeTab === "post") {
      const timer = setTimeout(() => {
        savePost({ type: "post", content, platform, date: null, image, status: "Draft", tone });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [content, platform, tone]);

  useEffect(() => {
    if (location.state?.caption) {
      setContent(location.state.caption);
      setActiveTab("post");
    }

    if (location.state?.presetDate) {
      setDate(location.state.presetDate);
      setActiveTab("post");
    }

    if (location.state?.post?.status === "Draft") {
      const p = location.state.post;
      setContent(p.content || "");
      setPlatform(p.platform || "Twitter");
      setImage(p.image || null);
      setTone(p.tone || "casual");
      setDate("");
      setActiveTab("post");
    }
  }, [location.state]);

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault();
        setShowAI(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleReelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReelVideo(file);
    const videoUrl = URL.createObjectURL(file);
    setReelVideoPreview(videoUrl);
  };

  const handleYoutubeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setYoutubeVideo(file);
    const videoUrl = URL.createObjectURL(file);
    setYoutubeVideoPreview(videoUrl);
  };

  const generateWithAI = async () => {
    try {
      setAiLoading(true);

      const prompt =
        aiTarget === "post"
          ? content || "Write a social media post about productivity"
          : reelCaption || "Write a viral reel caption";

      const res = await fetch(AI_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      aiTarget === "post"
        ? setContent(data.text)
        : setReelCaption(data.text);

      toast.success("AI caption generated ✨");
      setShowAI(false);
    } catch {
      toast.error("AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSavePost = () => {
    if (!content || !date) return toast.error("Please fill all fields");
    if (isCharLimitExceeded()) return toast.error(`Character limit exceeded for ${platform}!`);
    savePost({ 
      type: "post", 
      content: content + (hashtags ? " " + hashtags : ""), 
      platform, 
      date, 
      image, 
      status: "Upcoming",
      tone,
      wordCount: getWordCount()
    });
    toast.success("Post scheduled successfully 🚀");
    navigate("/dashboard");
  };

  const handleSaveDraft = () => {
    if (!content) return toast.error("Write something before saving draft");
    savePost({ 
      type: "post", 
      content, 
      platform, 
      date: null, 
      image, 
      status: "Draft",
      tone,
      wordCount: getWordCount()
    });
    toast.success("Draft saved 📝");
  };

  const handleSaveReel = () => {
    if (!reelVideo || !reelDate)
      return toast.error("Upload reel video & date");

    savePost({
      type: "reel",
      content: reelCaption,
      platform: reelPlatform,
      date: reelDate,
      videoName: reelVideo.name,
      status: "Upcoming",
    });

    toast.success("Reel scheduled 🎬");
    navigate("/dashboard");
  };

  const handleSaveYoutube = () => {
    if (!youtubeTitle || !youtubeDescription || !youtubeVideo || !youtubeDate) {
      return toast.error("Please fill all YouTube fields");
    }

    savePost({
      type: "youtube",
      title: youtubeTitle,
      description: youtubeDescription,
      tags: youtubeTag,
      platform: "YouTube",
      date: youtubeDate,
      videoName: youtubeVideo.name,
      status: "Upcoming",
    });

    toast.success("YouTube video scheduled 📺");
    navigate("/dashboard");
  };

  return (
    <div className="create-post preview-layout">
      <div>
        <div className="tab-bar">
          <button className={activeTab === "post" ? "active" : ""} onClick={() => setActiveTab("post")}>
            📝 Create Post
          </button>
          <button className={activeTab === "reel" ? "active" : ""} onClick={() => setActiveTab("reel")}>
            🎬 Create Reel
          </button>
          <button className={activeTab === "youtube" ? "active" : ""} onClick={() => setActiveTab("youtube")}>
            📺 YouTube Video
          </button>
        </div>

        {activeTab === "post" && (
          <>
            <h2>Create Post</h2>
            <div className="ai-tools-bar">
              <button onClick={() => { setAiTarget("post"); setShowAI(true); }} className="ai-assist-btn">
                ✨ AI Assist
              </button>
              <button onClick={() => setShowTextToImage(true)} className="ai-tool-btn text-to-image-btn">
                🎨 Text to Image
              </button>
              <button onClick={() => setShowAvatarGenerator(true)} className="ai-tool-btn avatar-btn">
                🎭 AI Avatar
              </button>
            </div>

            <div className="post-info-bar">
              <div className="info-stat">
                <span className="label">Characters:</span>
                <span className={`value ${isCharLimitExceeded() ? 'exceeded' : ''}`}>
                  {content.length} / {getCharLimit()}
                </span>
              </div>
              <div className="info-stat">
                <span className="label">Words:</span>
                <span className="value">{getWordCount()}</span>
              </div>
              <div className="info-stat">
                <span className="label">Best Time:</span>
                <span className="value">{BEST_POSTING_TIMES[platform]}</span>
              </div>
            </div>

            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content..." 
              className={isCharLimitExceeded() ? 'char-limit-exceeded' : ''}
            />

            <div className="tone-selector">
              <label>Post Tone:</label>
              <div className="tone-buttons">
                <button 
                  className={`tone-btn ${tone === 'professional' ? 'active' : ''}`}
                  onClick={() => setTone('professional')}
                >
                  💼 Professional
                </button>
                <button 
                  className={`tone-btn ${tone === 'casual' ? 'active' : ''}`}
                  onClick={() => setTone('casual')}
                >
                  😊 Casual
                </button>
                <button 
                  className={`tone-btn ${tone === 'viral' ? 'active' : ''}`}
                  onClick={() => setTone('viral')}
                >
                  🔥 Viral
                </button>
              </div>
            </div>

            <div className="hashtag-section">
              <button onClick={generateHashtagSuggestions} className="hashtag-btn">
                🏷️ Generate Hashtags
              </button>
              {hashtags && (
                <div className="hashtag-display">
                  {hashtags.split(" ").map((tag, idx) => (
                    <span key={idx} className="hashtag-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} className="preview-image" />}

            <div className="row">
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option>Twitter</option>
                <option>LinkedIn</option>
                <option>Instagram</option>
                <option>YouTube</option>
                <option>Facebook</option>
              </select>

              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
              <button onClick={handleSavePost} className="schedule-btn">Schedule</button>
              <button className="draft-btn" onClick={handleSaveDraft}>Save Draft</button>
              <button onClick={copyToClipboard} className="copy-btn">📋 Copy</button>
            </div>
          </>
        )}

        {activeTab === "reel" && (
          <>
            <h2>Create Reel</h2>
            <div className="ai-tools-bar">
              <button onClick={() => { setAiTarget("reel"); setShowAI(true); }} className="ai-assist-btn">
                ✨ AI Assist
              </button>
              <button onClick={() => setShowTextToImage(true)} className="ai-tool-btn text-to-image-btn">
                🎨 Text to Image
              </button>
              <button onClick={() => setShowAvatarGenerator(true)} className="ai-tool-btn avatar-btn">
                🎭 AI Avatar
              </button>
            </div>

            <textarea 
              value={reelCaption} 
              onChange={(e) => setReelCaption(e.target.value)} 
              placeholder="Write your reel caption..."
            />
            <input type="file" accept="video/*" onChange={handleReelUpload} />
            
            {reelVideoPreview && (
              <div className="video-preview-container">
                <video
                  ref={reelVideoRef}
                  src={reelVideoPreview}
                  controls
                  onError={() => setReelVideoError("Failed to load video. Try a different file.")}
                  onLoadedMetadata={() => setReelVideoError("")}
                  className="video-preview"
                  style={{ width: "100%", maxHeight: "300px", borderRadius: "12px", objectFit: "cover" }}
                />
                {reelVideoError && <div className="video-error">{reelVideoError}</div>}
                {!reelVideoError && (
                  <div className="video-actions">
                    <button onClick={() => reelVideoRef.current?.play()}>Play Preview</button>
                    <button onClick={() => reelVideoRef.current?.pause()}>Pause</button>
                  </div>
                )}
                <p className="video-info">🎥 {reelVideo?.name}</p>
              </div>
            )}

            <div className="row">
              <select value={reelPlatform} onChange={(e) => setReelPlatform(e.target.value)}>
                <option>Instagram Reels</option>
                <option>Instagram Stories</option>
                <option>Facebook Reels</option>
                <option>YouTube Shorts</option>
                <option>TikTok</option>
              </select>

              <input type="datetime-local" value={reelDate} onChange={(e) => setReelDate(e.target.value)} />
              <button onClick={handleSaveReel} className="schedule-btn">Schedule Reel</button>
            </div>
          </>
        )}

        {activeTab === "youtube" && (
          <>
            <h2>Create YouTube Video</h2>
            <div className="ai-tools-bar">
              <button onClick={() => { setAiTarget("youtube"); setShowAI(true); }} className="ai-assist-btn">
                ✨ AI Assist
              </button>
              <button onClick={() => setShowTextToImage(true)} className="ai-tool-btn text-to-image-btn">
                🎨 Text to Image
              </button>
              <button onClick={() => setShowAvatarGenerator(true)} className="ai-tool-btn avatar-btn">
                🎭 AI Avatar
              </button>
            </div>

            <input
              type="text"
              placeholder="Video Title"
              value={youtubeTitle}
              onChange={(e) => setYoutubeTitle(e.target.value)}
              className="input-field"
            />
            <textarea
              placeholder="Video Description"
              value={youtubeDescription}
              onChange={(e) => setYoutubeDescription(e.target.value)}
              className="textarea-field"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={youtubeTag}
              onChange={(e) => setYoutubeTag(e.target.value)}
              className="input-field"
            />
            <input type="file" accept="video/*" onChange={handleYoutubeUpload} />
            
            {youtubeVideoPreview && (
              <div className="video-preview-container">
                <video
                  ref={youtubeVideoRef}
                  src={youtubeVideoPreview}
                  controls
                  onError={() => setYoutubeVideoError("Failed to load video. Try a different file.")}
                  onLoadedMetadata={() => setYoutubeVideoError("")}
                  className="video-preview"
                  style={{ width: "100%", maxHeight: "300px", borderRadius: "12px", objectFit: "cover" }}
                />
                {youtubeVideoError && <div className="video-error">{youtubeVideoError}</div>}
                {!youtubeVideoError && (
                  <div className="video-actions">
                    <button onClick={() => youtubeVideoRef.current?.play()}>Play Preview</button>
                    <button onClick={() => youtubeVideoRef.current?.pause()}>Pause</button>
                  </div>
                )}
                <p className="video-info">🎬 {youtubeVideo?.name}</p>
              </div>
            )}

            <div className="row">
              <input type="datetime-local" value={youtubeDate} onChange={(e) => setYoutubeDate(e.target.value)} />
              <button onClick={handleSaveYoutube} className="schedule-btn">Schedule Video</button>
            </div>
          </>
        )}
      </div>

      {activeTab === "post" && (
        <PostPreview type="post" content={content} image={image} platform={platform} />
      )}

      {showAI && (
        <AICaptionModal
          text={aiTarget === "post" ? content : reelCaption}
          onApply={(newText) => {
            if (aiTarget === "post") {
              setContent(newText);
            } else if (aiTarget === "reel") {
              setReelCaption(newText);
            } else if (aiTarget === "youtube") {
              setYoutubeDescription(newText);
            }
            toast.success("Caption updated ✨");
            setShowAI(false);
          }}
          onClose={() => setShowAI(false)}
          loading={aiLoading}
        />
      )}

      {showTextToImage && (
        <TextToImageModal
          onApply={(imageUrl) => {
            setImage(imageUrl);
            setShowTextToImage(false);
          }}
          onClose={() => setShowTextToImage(false)}
        />
      )}

      {showAvatarGenerator && (
        <AvatarGenerator
          onApply={(avatarUrl) => {
            setImage(avatarUrl);
            setShowAvatarGenerator(false);
          }}
          onClose={() => setShowAvatarGenerator(false)}
        />
      )}
    </div>
  );
}
