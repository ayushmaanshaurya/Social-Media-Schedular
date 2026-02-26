const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.warn("OPENAI_API_KEY not set — AI routes will return mock responses.");
  openai = {
    chat: {
      completions: {
        create: async (opts) => {
          return {
            choices: [
              {
                message: {
                  content:
                    "[MOCK RESPONSE] OPENAI_API_KEY not configured. Set OPENAI_API_KEY to get real AI responses.",
                },
              },
            ],
          };
        },
      },
    },
  };
}

router.post("/caption", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a social media expert." },
        { role: "user", content: prompt },
      ],
    });

    res.json({
      text: response.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

// Text to Image Generation
router.post("/text-to-image", async (req, res) => {
  try {
    const { prompt, size = "1024x1024" } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    
    if (!HF_API_KEY) {
      return res.status(400).json({ 
        error: "Image generation API not configured. Client-side generation will be used instead." 
      });
    }

    // Use Hugging Face Stable Diffusion API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const arrayBuf = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuf);
    const base64Image = imageBuffer.toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    res.json({
      imageUrl,
      prompt,
    });
  } catch (err) {
    console.error("Text-to-image error:", err);
    res.status(500).json({ error: "Image generation failed. Using client-side fallback." });
  }
});

// Avatar Generation
router.post("/generate-avatar", async (req, res) => {
  try {
    const { style = "cartoon", seed, prompt } = req.body;

    if (!seed && !prompt) {
      return res.status(400).json({ error: "Provide seed or prompt" });
    }

    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!HF_API_KEY) {
      return res.status(400).json({ 
        error: "Avatar generation API not configured. Client-side generation will be used instead." 
      });
    }

    const avatarPrompt = prompt || `Create a ${style} avatar with unique features, seed: ${seed}`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: "POST",
        body: JSON.stringify({
          inputs: `${avatarPrompt}, portrait, hd, ${style} style`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const arrayBuf = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuf);
    const base64Image = imageBuffer.toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    res.json({
      imageUrl,
      style,
      prompt: avatarPrompt,
    });
  } catch (err) {
    console.error("Avatar generation error:", err);
    res.status(500).json({ error: "Avatar generation failed. Using client-side fallback." });
  }
});

// Quick Avatar Styles
router.get("/avatar-styles", (req, res) => {
  res.json({
    styles: [
      { id: "cartoon", name: "Cartoon", emoji: "🎨" },
      { id: "realistic", name: "Realistic", emoji: "📸" },
      { id: "anime", name: "Anime", emoji: "✨" },
      { id: "pixel", name: "Pixel Art", emoji: "🎮" },
      { id: "watercolor", name: "Watercolor", emoji: "🎭" },
      { id: "professional", name: "Professional", emoji: "💼" },
    ],
  });
});

// General content generation: captions, hashtags, alt-text
router.post("/generate", async (req, res) => {
  try {
    const { action = "caption", text = "", platform = "instagram", tone = "friendly", count = 3 } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    let userPrompt = "";

    if (action === "caption") {
      userPrompt = `Write ${count} ${tone} social media captions for ${platform} based on the following content:\n\n${text}\n\nReturn results as a JSON array.`;
    } else if (action === "hashtags") {
      userPrompt = `Suggest ${count} sets of relevant hashtags (as comma-separated lists) for the following content targeted to ${platform}:\n\n${text}`;
    } else if (action === "altText") {
      userPrompt = `Write descriptive image alt-text (concise, <=125 chars) for an image described as: ${text}`;
    } else {
      userPrompt = `Create ${count} short social media suggestions for the following content: ${text}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful social media content assistant." },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const textOut = response.choices?.[0]?.message?.content || "";

    res.json({ result: textOut });
  } catch (err) {
    console.error("/generate error:", err);
    res.status(500).json({ error: "Generation failed" });
  }
});

// Repurpose content into multiple platform formats
router.post("/repurpose", async (req, res) => {
  try {
    const { content = "", title = "", tone = "professional" } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Content is required" });
    }

    const prompt = `You are a senior content repurposing specialist. Given the following source content, produce: 1) a LinkedIn article summary (2-3 short paragraphs), 2) a Tweet thread of 4-6 tweets, 3) an Instagram caption (short) plus 10 relevant hashtags, and 4) a short YouTube video description. Keep tone: ${tone}. Source content:\n\nTitle: ${title}\n\n${content}\n\nReturn as JSON with keys: linkedin, thread, instagram, youtube_description.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful social media content assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const resultText = response.choices?.[0]?.message?.content || "";
    res.json({ result: resultText });
  } catch (err) {
    console.error("/repurpose error:", err);
    res.status(500).json({ error: "Repurposing failed" });
  }
});

// Simple sentiment analysis for a piece of text
router.post("/sentiment", async (req, res) => {
  try {
    const { text = "" } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    const prompt = `Analyze the sentiment of the following text. Provide: sentiment (positive/neutral/negative), score from -1 to 1, and a one-sentence rationale. Text:\n\n${text}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an assistant that provides concise sentiment analysis." },
        { role: "user", content: prompt },
      ],
      temperature: 0,
      max_tokens: 200,
    });

    const resultText = response.choices?.[0]?.message?.content || "";
    res.json({ result: resultText });
  } catch (err) {
    console.error("/sentiment error:", err);
    res.status(500).json({ error: "Sentiment analysis failed" });
  }
});

// Trend spotting using YouTube mostPopular (requires YOUTUBE_API_KEY)
router.get("/trends", async (req, res) => {
  try {
    const region = req.query.region || "US";
    const YT_KEY = process.env.YOUTUBE_API_KEY;
    if (!YT_KEY) return res.status(400).json({ error: "YOUTUBE_API_KEY not configured" });

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${region}&maxResults=10&key=${YT_KEY}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`YouTube API ${r.status}`);
    const j = await r.json();

    // Build a simple set of topic suggestions from titles
    const videos = (j.items || []).map((v) => ({
      id: v.id,
      title: v.snippet.title,
      description: v.snippet.description,
      channel: v.snippet.channelTitle,
      views: v.statistics?.viewCount,
    }));

    // Optionally summarize topics via OpenAI
    const topicsPrompt = `Given these video titles and descriptions, suggest 6 short content topics or angles a brand could post about (one-line each):\n\n${videos.map((v) => v.title + " - " + v.description).join("\n\n")}`;

    const aiResp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a creative trend analyst." },
        { role: "user", content: topicsPrompt },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const topics = aiResp.choices?.[0]?.message?.content || "";

    res.json({ videos, topics });
  } catch (err) {
    console.error("/trends error:", err);
    res.status(500).json({ error: "Trend spotting failed" });
  }
});

module.exports = router;
