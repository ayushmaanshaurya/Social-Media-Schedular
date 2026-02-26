import "./AICaptionModal.css";
import { useState } from "react";
import {
  generateCaption,
  shortenCaption,
  addEmojis,
  rewriteCaption,
  generateHashtags,
  optimizeCaption,
} from "../utils/aiCaption";

export default function AICaptionModal({
  text,
  onApply,
  onClose,
  loading = false,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (actionFn) => {
    setIsProcessing(true);
    try {
      if (!text || text.trim().length === 0) {
        alert("Please write something first! 💭");
        return;
      }

      const result = actionFn(text || "");
      if (result && result.trim().length > 0) {
        onApply(result);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="ai-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
        <h3>🤖 AI Caption Assistant</h3>
        <p>Transform your caption with AI magic</p>

        <div className="ai-button-grid">
          <button 
            className="ai-modal ai-btn-generate"
            onClick={() => handleAction((t) => generateCaption(t, "casual"))}
            disabled={loading || isProcessing}
            title="Generate a casual version"
          >
            ✨ Generate
          </button>

          <button 
            className="ai-modal ai-btn-professional"
            onClick={() => handleAction((t) => generateCaption(t, "professional"))}
            disabled={loading || isProcessing}
            title="Make it professional"
          >
            🎯 Professional
          </button>

          <button 
            className="ai-modal ai-btn-viral"
            onClick={() => handleAction((t) => generateCaption(t, "viral"))}
            disabled={loading || isProcessing}
            title="Make it viral-worthy"
          >
            🔥 Viral
          </button>

          <button 
            className="ai-modal ai-btn-shorten"
            onClick={() => handleAction(shortenCaption)}
            disabled={loading || isProcessing}
            title="Make it shorter"
          >
            ✂️ Shorten
          </button>

          <button 
            className="ai-modal ai-btn-rewrite"
            onClick={() => handleAction(rewriteCaption)}
            disabled={loading || isProcessing}
            title="Rewrite with fresh perspective"
          >
            🔁 Rewrite
          </button>

          <button 
            className="ai-modal ai-btn-emojis"
            onClick={() => handleAction(addEmojis)}
            disabled={loading || isProcessing}
            title="Add relevant emojis"
          >
            😍 Add Emojis
          </button>

          <button 
            className="ai-modal ai-btn-optimize"
            onClick={() => handleAction(optimizeCaption)}
            disabled={loading || isProcessing}
            title="Optimize overall"
          >
            ⚡ Optimize
          </button>

          <button 
            className="ai-modal ai-btn-hashtags"
            onClick={() => handleAction(generateHashtags)}
            disabled={loading || isProcessing}
            title="Generate hashtags"
          >
            #️⃣ Add Hashtags
          </button>
        </div>

        <button 
          className="close"
          onClick={onClose}
          disabled={loading || isProcessing}
        >
          Close
        </button>
      </div>
    </div>
  );
}
