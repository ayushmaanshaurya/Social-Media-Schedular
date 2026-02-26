import "./PostPreview.css";

export default function PostPreview({
  content,
  caption,
  image,
  platform = "Post",
  onApply,
}) {
  const text = content ?? caption ?? "";

  return (
    <div className={`preview-card ${platform.toLowerCase()}`}>
      <div className="preview-header">{platform} Preview</div>

      <div className="preview-body">
        <p className="preview-content">
          {text || "Your post preview will appear here..."}
        </p>

        {image && (
          <img src={image} alt="preview" className="preview-img" />
        )}

        {onApply && (
          <button
            className="apply-btn"
            onClick={() => onApply(text)}
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}

