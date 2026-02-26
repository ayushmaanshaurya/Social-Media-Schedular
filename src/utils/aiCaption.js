export const generateCaption = (text, tone = "casual") => {
  if (!text || text.trim().length === 0) {
    return "Write something first! 💭";
  }

  const trimmedText = text.trim();

  const tones = {
    professional: {
      prefix: "Here's an insight worth sharing: ",
      suffix: " #thoughtleadership",
    },
    casual: {
      prefix: "Quick thought 💭 ",
      suffix: " #justsharing",
    },
    viral: {
      prefix: "You won't believe this 👀 ",
      suffix: " #trending #viral",
    },
  };

  const toneConfig = tones[tone] || tones.casual;
  return `${toneConfig.prefix}${trimmedText}${toneConfig.suffix}`;
};

export const shortenCaption = (text) => {
  if (!text || text.trim().length === 0) {
    return "Text is empty";
  }

  const words = text.trim().split(" ");
  if (words.length <= 15) {
    return text;
  }

  const shortened = words.slice(0, 15).join(" ");
  return shortened + "...";
};

export const addEmojis = (text) => {
  if (!text || text.trim().length === 0) {
    return "Text is empty";
  }

  const emojiMap = {
    happy: "😊",
    love: "❤️",
    fire: "🔥",
    rocket: "🚀",
    star: "⭐",
    success: "✨",
    amazing: "🤩",
    focus: "👀",
    thumb: "👍",
    clap: "👏",
    growth: "📈",
    learn: "📚",
    passion: "💖",
    energy: "⚡",
    goal: "🎯",
    team: "👥",
    win: "🏆",
    check: "✅",
    idea: "💡",
    creative: "🎨",
  };

  let result = text;
  Object.keys(emojiMap).forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    result = result.replace(regex, emojiMap[word]);
  });

  // If no emojis were added, append one
  if (result === text) {
    result = text + " ✨";
  }

  return result;
};

export const rewriteCaption = (text) => {
  if (!text || text.trim().length === 0) {
    return "Text is empty";
  }

  const rewriteOptions = [
    `Fresh take on this: ${text} 🎯`,
    `Let me put this differently: ${text} 💭`,
    `Another way to see it: ${text} 👀`,
    `Different perspective: ${text} 🔍`,
    `So here's the thing: ${text} ✨`,
  ];

  const randomRewrite = rewriteOptions[Math.floor(Math.random() * rewriteOptions.length)];
  return randomRewrite;
};

export const generateHashtags = (text, count = 5) => {
  if (!text || text.trim().length === 0) {
    return "#socialmedia #content #creation";
  }

  const commonHashtags = [
    "#socialmedia",
    "#content",
    "#creation",
    "#entrepreneur",
    "#marketing",
    "#growth",
    "#engagement",
    "#audience",
    "#strategy",
    "#creative",
    "#inspiration",
    "#success",
    "#mindset",
    "#hustle",
    "#grind",
  ];

  const shuffled = [...commonHashtags].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).join(" ");
};

export const optimizeCaption = (text) => {
  if (!text || text.trim().length === 0) {
    return "Text is empty";
  }

  let optimized = text.trim();

  // Add line breaks for better readability (max 2 lines)
  const sentences = optimized.split(". ");
  if (sentences.length > 1) {
    optimized = sentences.slice(0, 2).join(".\n\n").trim() + ".";
  }

  // Add relevant emoji if not present
  if (!optimized.match(/[\p{Emoji}]/gu)) {
    optimized = optimized + " ✨";
  }

  // Capitalize first letter
  optimized = optimized.charAt(0).toUpperCase() + optimized.slice(1);

  return optimized;
};
