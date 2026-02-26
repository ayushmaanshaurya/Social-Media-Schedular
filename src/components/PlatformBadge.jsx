export default function PlatformBadge({ platform }) {
  const colors = {
    Twitter: "#1DA1F2",
    LinkedIn: "#0077b5",
    Instagram: "#E1306C",
    YouTube: "#FF0000",
    "YouTube Shorts": "#FF0000",
    Facebook: "#1877F2",
    TikTok: "#000000",
    "Instagram Reels": "#E1306C",
    "Instagram Stories": "#E1306C",
    "Facebook Reels": "#1877F2",
  };

  return (
    <span
      style={{
        background: colors[platform] || "#666",
        color: "#fff",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "600",
      }}
    >
      {platform}
    </span>
  );
}
