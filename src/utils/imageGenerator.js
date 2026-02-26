/**
 * Generate placeholder images and avatars locally
 * These are fallbacks when the AI API is not configured
 */

// Generate a colorful gradient image placeholder
export const generateGradientImage = (prompt = "", size = "1024x1024") => {
  const colors = [
    { bg: "#1e293b", accent: "#0ea5e9" },
    { bg: "#6b21a8", accent: "#ec4899" },
    { bg: "#b91c1c", accent: "#fbbf24" },
    { bg: "#065f46", accent: "#10b981" },
    { bg: "#1e3a8a", accent: "#3b82f6" },
    { bg: "#7c2d12", accent: "#f97316" },
  ];

  // Hash the prompt to get a consistent color
  let hash = 0;
  for (let i = 0; i < (prompt || "").length; i++) {
    hash = ((hash << 5) - hash) + (prompt || "").charCodeAt(i);
    hash = hash & hash;
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const color = colors[colorIndex];

  const canvas = document.createElement("canvas");
  const [width, height] = size.split("x").map(Number);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, color.bg);
  gradient.addColorStop(1, color.accent);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add some visual interest with shapes
  ctx.fillStyle = `${color.accent}40`;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 200 + 50,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Add text
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const text = prompt.substring(0, 20) || "AI Generated";
  ctx.fillText(text, width / 2, height / 2);

  return canvas.toDataURL("image/jpeg");
};

// Generate avatar with different styles
export const generateAvatarPlaceholder = (style = "cartoon", seed = Math.random()) => {
  const styles = {
    cartoon: {
      colors: ["#FF6B9D", "#FEC8D8", "#FFDFD3"],
      icon: "😊",
    },
    realistic: {
      colors: ["#A0826D", "#C9B8A3", "#D4C4B0"],
      icon: "👤",
    },
    anime: {
      colors: ["#FFB6D9", "#FFC0D9", "#FFE0F0"],
      icon: "✨",
    },
    pixel: {
      colors: ["#FF00FF", "#00FFFF", "#FFFF00"],
      icon: "🎮",
    },
    watercolor: {
      colors: ["#B5E7A0", "#A8D8EA", "#AA96DA"],
      icon: "🎨",
    },
    professional: {
      colors: ["#1F2937", "#4B5563", "#6B7280"],
      icon: "💼",
    },
  };

  const config = styles[style] || styles.cartoon;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const ctx = canvas.getContext("2d");

  // Background gradient
  const gradient = ctx.createRadialGradient(512, 512, 100, 512, 512, 700);
  gradient.addColorStop(0, config.colors[0]);
  gradient.addColorStop(0.5, config.colors[1]);
  gradient.addColorStop(1, config.colors[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);

  // Draw avatar circle
  ctx.fillStyle = config.colors[1];
  ctx.beginPath();
  ctx.arc(512, 512, 350, 0, Math.PI * 2);
  ctx.fill();

  // Add emoji/icon in center
  ctx.font = "bold 200px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(config.icon, 512, 512);

  // Add decorative circles
  ctx.strokeStyle = `${config.colors[2]}`;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(512, 512, 360, 0, Math.PI * 2);
  ctx.stroke();

  return canvas.toDataURL("image/jpeg");
};

// Generate a random avatar using canvas
export const generateRandomAvatar = (seed = Math.random()) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const ctx = canvas.getContext("2d");

  // Seeded random for consistency
  const seededRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Background
  const bgHue = Math.floor(seededRandom() * 360);
  ctx.fillStyle = `hsl(${bgHue}, 70%, 60%)`;
  ctx.fillRect(0, 0, 1024, 1024);

  // Draw random shapes
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `hsla(${(bgHue + 180) % 360}, 70%, 50%, 0.3)`;
    ctx.beginPath();
    ctx.arc(
      seededRandom() * 1024,
      seededRandom() * 1024,
      seededRandom() * 200 + 50,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  return canvas.toDataURL("image/jpeg");
};
