import "./AvatarGenerator.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { generateAvatarPlaceholder, generateRandomAvatar } from "../utils/imageGenerator";

export default function AvatarGenerator({ onApply, onClose, loading = false }) {
  const [style, setStyle] = useState("cartoon");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedAvatar, setGeneratedAvatar] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [styles, setStyles] = useState([]);
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => {
    // Fetch available avatar styles
    fetch("http://localhost:5000/ai/avatar-styles")
      .then((res) => res.json())
      .then((data) => setStyles(data.styles))
      .catch((err) => {
        // Fallback to local styles
        console.log("Using local avatar styles");
        setStyles([
          { id: "cartoon", name: "Cartoon", emoji: "🎨" },
          { id: "realistic", name: "Realistic", emoji: "📸" },
          { id: "anime", name: "Anime", emoji: "✨" },
          { id: "pixel", name: "Pixel Art", emoji: "🎮" },
          { id: "watercolor", name: "Watercolor", emoji: "🎭" },
          { id: "professional", name: "Professional", emoji: "💼" },
        ]);
      });
  }, []);

  const handleGenerateAvatar = async () => {
    setIsGenerating(true);
    try {
      if (useCustom && customPrompt.trim()) {
        // Try API with custom prompt
        const response = await fetch("http://localhost:5000/ai/generate-avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            style,
            prompt: customPrompt,
            seed: Math.random(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setGeneratedAvatar(data.imageUrl);
          toast.success("Avatar generated! 🎭");
        } else {
          // Fallback
          const avatar = generateAvatarPlaceholder(style, Math.random());
          setGeneratedAvatar(avatar);
          toast.success("Avatar created! 🎭");
        }
      } else {
        // Use local generation
        const avatar = generateAvatarPlaceholder(style, Math.random());
        setGeneratedAvatar(avatar);
        toast.success("Avatar created! 🎭");
      }
    } catch (error) {
      console.log("Using local avatar generator");
      const avatar = generateAvatarPlaceholder(style, Math.random());
      setGeneratedAvatar(avatar);
      toast.success("Avatar created! 🎭");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseAvatar = () => {
    if (generatedAvatar) {
      onApply(generatedAvatar);
      toast.success("Avatar added! 🎉");
      onClose();
    }
  };

  const regenerateAvatar = () => {
    handleGenerateAvatar();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content avatar-generator-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>🎭 AI Avatar Generator</h3>
          <p>Create your perfect avatar</p>
        </div>

        <div className="avatar-content">
          {/* Avatar Preview */}
          <div className="avatar-preview-section">
            {generatedAvatar ? (
              <div className="avatar-display">
                <img src={generatedAvatar} alt="Generated Avatar" />
                <div className="avatar-actions">
                  <button
                    className="btn-regenerate"
                    onClick={regenerateAvatar}
                    disabled={isGenerating || loading}
                  >
                    🔄 Regenerate
                  </button>
                  <button
                    className="btn-use"
                    onClick={handleUseAvatar}
                    disabled={isGenerating || loading}
                  >
                    ✅ Use Avatar
                  </button>
                </div>
              </div>
            ) : (
              <div className="avatar-placeholder">
                <div className="placeholder-icon">✨</div>
                <p>Your avatar will appear here</p>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="avatar-settings">
            {!useCustom ? (
              <>
                <div className="settings-group">
                  <label>Choose Style</label>
                  <div className="style-grid">
                    {styles.map((s) => (
                      <button
                        key={s.id}
                        className={`style-btn ${style === s.id ? "active" : ""}`}
                        onClick={() => setStyle(s.id)}
                        title={s.name}
                        disabled={isGenerating || loading}
                      >
                        <span className="style-emoji">{s.emoji}</span>
                        <span className="style-name">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn-custom-toggle"
                  onClick={() => setUseCustom(true)}
                  disabled={isGenerating || loading}
                >
                  ✨ Custom Prompt
                </button>
              </>
            ) : (
              <>
                <div className="settings-group">
                  <label>Custom Description</label>
                  <textarea
                    placeholder="E.g., 'Anime girl with purple hair and cat ears'"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={3}
                    disabled={isGenerating || loading}
                  />
                </div>

                <button
                  className="btn-custom-toggle"
                  onClick={() => setUseCustom(false)}
                  disabled={isGenerating || loading}
                >
                  ← Back to Styles
                </button>
              </>
            )}

            <button
              className="btn-generate"
              onClick={handleGenerateAvatar}
              disabled={isGenerating || loading || (useCustom && !customPrompt.trim())}
            >
              {isGenerating ? "⏳ Creating..." : "✨ Generate Avatar"}
            </button>
          </div>
        </div>

        <button className="btn-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
