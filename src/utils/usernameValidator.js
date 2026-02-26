export const validateUsername = (username) => {
  if (!username || username.length === 0) {
    return { valid: false, error: "Username is required" };
  }

  if (username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }

  if (username.length > 20) {
    return { valid: false, error: "Username must be less than 20 characters" };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { 
      valid: false, 
      error: "Only letters, numbers, underscores, and hyphens allowed" 
    };
  }

  if (/(.)\1{2,}/.test(username)) {
    return { 
      valid: false, 
      error: "❌ Cannot have 3+ continuous same characters (e.g., 'aaa', '111')" 
    };
  }

  return { valid: true, error: "" };
};

const adjectives = [
  "swift", "smart", "bright", "clever", "quick", "bold", "cosmic", "digital",
  "epic", "fancy", "golden", "happy", "iconic", "jazzy", "keen", "lucky",
  "mighty", "noble", "optimal", "prime", "quantum", "radical", "stellar", "titan",
  "ultra", "vital", "wise", "zealous"
];

const nouns = [
  "panda", "eagle", "tiger", "phoenix", "dragon", "falcon", "wolf", "lion",
  "shark", "bear", "raven", "fox", "owl", "hawk", "cobra", "viper",
  "ninja", "knight", "sage", "hero", "titan", "guru", "sage", "wizard"
];

export const generateUsernamesuggestions = (baseUsername = "") => {
  const suggestions = [];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999);
  suggestions.push(`${adj}_${noun}${num}`);

  const adj2 = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun2 = nouns[Math.floor(Math.random() * nouns.length)];
  suggestions.push(`${adj2}${noun2}`);

  const adj3 = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun3 = nouns[Math.floor(Math.random() * nouns.length)];
  const num3 = Math.floor(Math.random() * 99);
  suggestions.push(`${noun3}-${adj3}-${num3}`);

  if (baseUsername.length > 0) {
    const cleaned = baseUsername.replace(/(.)\1{2,}/g, (match) => match[0] + match[0]);
    suggestions.unshift(cleaned);
  }

  return suggestions.slice(0, 3);
};
