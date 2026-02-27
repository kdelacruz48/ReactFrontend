import { useState } from "react";
import axios from "axios";

export default function NewPost({ token, username, role, onClose, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tag, setTag] = useState("General");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const TAG_OPTIONS = ["Art", "General", "Music", "Life", "Projects", "Tech"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    setLoading(true);

    if (role !== "Admin") {
      setErrorMessages(["Only Admin users can create posts."]);
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "https://blogapi-production-97d7.up.railway.app/api/BlogAPI",
        { userName: username, title, post, imageUrl, tag },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setPost("");
      setImageUrl("");
      setTag("General");

      if (onPostCreated) await onPostCreated();
      if (onClose) onClose();
    } catch (err) {
      console.error("Post failed", err);
      const apiErrors =
        err.response?.data?.errorMessages ||
        [err.response?.data?.message || "Failed to create post"];
      setErrorMessages(apiErrors);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "#2a2a2a",
    color: "var(--text-primary)",
    border: "1px solid #3a3a3a",
    borderRadius: "8px",
    padding: "0.5rem 0.75rem",
    width: "100%",
    outline: "none",
    marginBottom: "0.75rem",
    fontSize: "0.95rem",
  };

  return (
    /* Overlay — clicking outside closes */
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        boxSizing: "border-box",
      }}
    >
      {/* Card — clicking inside does NOT close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--accent)",
          borderRadius: "16px",
          padding: "24px",
          width: "100%",
          maxWidth: "700px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 custom-text">Create Post</h5>
          <button className="custom-button" style={{ padding: "4px 12px" }} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            required
          />

          <textarea
            placeholder="Content"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
            rows={3}
            required
          />

          <input
            type="text"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={inputStyle}
          />

          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            style={inputStyle}
            className="custom-select"
            required
          >
            {TAG_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {errorMessages.length > 0 && (
            <div className="mb-2">
              {errorMessages.map((msg, idx) => (
                <div key={idx} style={{ color: "#ff6b6b", fontSize: "0.875rem" }}>{msg}</div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="custom-button"
            style={{ width: "100%", marginTop: "0.25rem" }}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}