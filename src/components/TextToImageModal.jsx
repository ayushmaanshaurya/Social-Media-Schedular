import "./TextToImageModal.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { generateGradientImage } from "../utils/imageGenerator";

export default function TextToImageModal({ onApply, onClose, loading = false }) {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSize, setImageSize] = useState("1024x1024");

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description!");
      return;
    }

    setIsGenerating(true);
    try {
      // Try to use backend API first
      const response = await fetch("http://localhost:5000/ai/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size: imageSize }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedImage(data.imageUrl);
        toast.success("Image generated successfully! 🎨");
      } else {
        // Fallback to local generation
        const localImage = generateGradientImage(prompt, imageSize);
        setGeneratedImage(localImage);
        toast.success("Generated with local renderer 🎨");
      }
    } catch (error) {
      // Fallback to local generation
      console.log("Using local image generator");
      const localImage = generateGradientImage(prompt, imageSize);
      setGeneratedImage(localImage);
      toast.success("Generated with local renderer 🎨");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onApply(generatedImage);
      toast.success("Image added to post! ✨");
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content text-to-image-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎨 Text to Image</h3>
          <p>Describe your image and we'll generate it</p>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Image Description</label>
            <textarea
              placeholder="E.g., 'A sunset over mountains, golden hour, professional photography'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isGenerating || loading}
            />
          </div>

          <div className="form-group">
            <label>Image Size</label>
            <select
              value={imageSize}
              onChange={(e) => setImageSize(e.target.value)}
              disabled={isGenerating || loading}
            >
              <option value="1024x1024">Square (1024x1024)</option>
              <option value="1024x768">Landscape (1024x768)</option>
              <option value="768x1024">Portrait (768x1024)</option>
            </select>
          </div>

          {generatedImage && (
            <div className="image-preview">
              <img src={generatedImage} alt="Generated" />
              <p className="preview-label">Generated Image</p>
            </div>
          )}

          <div className="modal-actions">
            <button
              className="btn-primary"
              onClick={handleGenerateImage}
              disabled={isGenerating || loading || !prompt.trim()}
            >
              {isGenerating ? "⏳ Generating..." : "✨ Generate Image"}
            </button>

            {generatedImage && (
              <button
                className="btn-success"
                onClick={handleUseImage}
                disabled={isGenerating || loading}
              >
                ✅ Use This Image
              </button>
            )}
          </div>
        </div>

        <button className="btn-close" onClick={onClose}>
          ✕ Close
        </button>
      </div>
    </div>
  );
}
