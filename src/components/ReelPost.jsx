import { useState } from "react";
import "./ReelPost.css";

export default function ReelPost() {
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [schedule, setSchedule] = useState("");
  const [video, setVideo] = useState(null);

  const handleSubmit = () => {
    if (!video) {
      alert("Please upload a reel video");
      return;
    }

    const reelData = {
      caption,
      platform,
      schedule,
      video,
      type: "reel",
    };

    console.log("Reel Scheduled:", reelData);
    alert("Reel scheduled successfully ✅");
  };

  return (
    <div className="reel-card">
      <h3>Create Reel</h3>

      {/* Video Upload */}
      <label className="reel-upload">
        <input
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => setVideo(e.target.files[0])}
        />
        {video ? video.name : "Upload Reel Video"}
      </label>

      {/* Caption */}
      <textarea
        placeholder="Write a caption for your reel..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      {/* Actions */}
      <div className="reel-actions">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option>Instagram</option>
          <option>Facebook</option>
        </select>

        <input
          type="datetime-local"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />

        <button onClick={handleSubmit}>Schedule Reel</button>
      </div>
    </div>
  );
}
