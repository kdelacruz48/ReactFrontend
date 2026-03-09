import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginWrapper from "./LoginWrapper";
import Login from "./Login";
import Register from "./Register";
import NewPost from "./NewPost";
import About from "./AboutMe.jsx";
import "./App.css";
import API_BASE from "./API";

const TRUNCATE_LENGTH = 120;
const TAG_OPTIONS = ["Art", "General", "Music", "Life", "Projects", "Tech", "Kira"];

function getImageUrl(post) {
  return post.imageUrl;
}

function getMediaType(url) {
  if (!url) return null;
  const clean = url.split("?")[0].toLowerCase();
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/vimeo\.com/.test(url)) return "vimeo";
  if (/res\.cloudinary\.com.*\/video\//.test(url)) return "video";
  if (/\.(mp4|webm|ogg)$/.test(clean)) return "video";
  if (/\.(jpg|jpeg|png|gif|webp|svg|avif)$/.test(clean)) return "image";
  return "image";
}

function getYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
  return match ? match[1] : null;
}

function getVimeoId(url) {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function CardMediaBadge({ url }) {
  const type = getMediaType(url);
  if (!type) return null;
  return <span className="card-media-badge">{type !== "image" ? "▶ Video" : "🖼 Image"}</span>;
}

function ModalMedia({ url }) {
  const type = getMediaType(url);
  if (!type) return null;
  if (type === "image") return <img src={url} alt="Post media" className="modal-media-img" onError={(e) => { e.target.style.display = "none"; }} />;
  if (type === "youtube") {
    const id = getYouTubeId(url);
    if (!id) return null;
    return <div className="modal-media-video-wrapper"><iframe src={`https://www.youtube.com/embed/${id}`} title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="modal-media-iframe" /></div>;
  }
  if (type === "vimeo") {
    const id = getVimeoId(url);
    if (!id) return null;
    return <div className="modal-media-video-wrapper"><iframe src={`https://player.vimeo.com/video/${id}`} title="Vimeo video" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="modal-media-iframe" /></div>;
  }
  if (type === "video") return <video controls className="modal-media-img"><source src={url} />Your browser does not support video playback.</video>;
  return null;
}

function PostModal({ post, onClose, auth, onPostDeleted, onPostEdited }) {
  const [mode, setMode] = useState("view");
  const [editData, setEditData] = useState({
    title: post.title,
    post: post.post,
    imageUrl: post.imageUrl || "",
    tag: post.tag,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = auth?.role === "Admin";

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (mode !== "view") setMode("view");
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, mode]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await axios.put(
        `${API_BASE}/api/BlogAPI/${post.id}`,
        {
          id: post.id,
          userName: post.userName,
          title: editData.title,
          post: editData.post,
          imageUrl: editData.imageUrl,
          tag: editData.tag,
          created_date: post.created_date,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      // Update local state directly — no re-fetch
      onPostEdited({
        ...post,
        title: editData.title,
        post: editData.post,
        imageUrl: editData.imageUrl,
        tag: editData.tag,
      });
    } catch (err) {
      console.error("Edit failed", err);
      setError("Failed to save changes. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await axios.delete(`${API_BASE}/api/BlogAPI/${post.id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      // Remove from local state directly — no re-fetch
      onPostDeleted(post.id);
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete post. Please try again.");
      setDeleting(false);
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
    fontSize: "0.92rem",
    boxSizing: "border-box",
  };

  return (
    <div className="post-modal-overlay" onClick={mode === "view" ? onClose : undefined}>
      <div className="post-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="post-modal-close" onClick={onClose}>✕</button>

        {mode === "view" && (
          <>
            <span className="post-modal-tag">{post.tag}</span>
            <h2 className="post-modal-title">{post.title}</h2>
            <p className="post-modal-meta">{post.userName} · {new Date(post.updated_date).toLocaleDateString()}</p>
            <div className="post-modal-divider" />
            {getImageUrl(post) && <ModalMedia url={getImageUrl(post)} />}
            <p className="post-modal-content">{post.post}</p>

            {isAdmin && (
              <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setMode("edit")}
                  style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.4)", color: "#00C2A8", borderRadius: "8px", padding: "0.4rem 1rem", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s ease" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,194,168,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,194,168,0.1)"}
                >✏️ Edit</button>
                <button
                  onClick={() => setMode("confirmDelete")}
                  style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.35)", color: "#ff6b6b", borderRadius: "8px", padding: "0.4rem 1rem", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s ease" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,80,80,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,80,80,0.08)"}
                >🗑 Delete</button>
              </div>
            )}
          </>
        )}

        {mode === "edit" && (
          <>
            <h2 className="post-modal-title" style={{ paddingRight: "2rem", marginBottom: "1.25rem" }}>Edit Post</h2>
            <div className="post-modal-divider" style={{ marginTop: 0 }} />
            <input type="text" placeholder="Title" value={editData.title} onChange={(e) => setEditData(d => ({ ...d, title: e.target.value }))} style={inputStyle} />
            <textarea placeholder="Content" value={editData.post} onChange={(e) => setEditData(d => ({ ...d, post: e.target.value }))} style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }} rows={5} />
            <input type="text" placeholder="Image URL (optional)" value={editData.imageUrl} onChange={(e) => setEditData(d => ({ ...d, imageUrl: e.target.value }))} style={inputStyle} />
            <select value={editData.tag} onChange={(e) => setEditData(d => ({ ...d, tag: e.target.value }))} style={{ ...inputStyle, marginBottom: "1rem" }} className="custom-select">
              {TAG_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {error && <p style={{ color: "#ff6b6b", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{error}</p>}
            <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end" }}>
              <button onClick={() => { setMode("view"); setError(""); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "var(--text-secondary)", borderRadius: "8px", padding: "0.4rem 1rem", fontSize: "0.82rem", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ background: "rgba(0,194,168,0.15)", border: "1px solid rgba(0,194,168,0.5)", color: "#00C2A8", borderRadius: "8px", padding: "0.4rem 1.2rem", fontSize: "0.82rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, fontWeight: 600 }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </>
        )}

        {mode === "confirmDelete" && (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🗑</div>
            <h3 style={{ color: "#EAEAEA", marginBottom: "0.5rem" }}>Delete this post?</h3>
            <p style={{ color: "#A0A0A0", fontSize: "0.88rem", marginBottom: "0.35rem" }}><strong style={{ color: "#EAEAEA" }}>{post.title}</strong></p>
            <p style={{ color: "#A0A0A0", fontSize: "0.82rem", marginBottom: "1.75rem" }}>This action cannot be undone.</p>
            {error && <p style={{ color: "#ff6b6b", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{error}</p>}
            <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
              <button onClick={() => { setMode("view"); setError(""); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "var(--text-secondary)", borderRadius: "8px", padding: "0.45rem 1.25rem", fontSize: "0.85rem", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.45)", color: "#ff6b6b", borderRadius: "8px", padding: "0.45rem 1.25rem", fontSize: "0.85rem", cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.6 : 1, fontWeight: 600 }}>
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, onClick }) {
  const isLong = post.post.length > TRUNCATE_LENGTH;
  const preview = isLong ? post.post.slice(0, TRUNCATE_LENGTH).trimEnd() + "…" : post.post;
  const hasMedia = !!getImageUrl(post);

  return (
    <div className="post-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick()}>
      <div className="post-card-inner">
        <div className="post-card-text">
          <div className="post-card-header">
            <span className="post-card-tag">{post.tag}</span>
            <span className="post-card-date">{new Date(post.updated_date).toLocaleDateString()}</span>
          </div>
          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-preview">{preview}</p>
          <div className="post-card-footer">
            <span className="post-card-user">{post.userName}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {hasMedia && <CardMediaBadge url={getImageUrl(post)} />}
              {isLong && <span className="post-card-read-more">Read more →</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostsPanel({ posts, filterTag, onFilterChange, onSelect }) {
  const tags = [...new Set(posts.map((p) => p.tag))].sort((a, b) => {
    if (a === "General") return -1;
    if (b === "General") return 1;
    return a.localeCompare(b);
  });
  const filtered = [...posts].filter((p) => !filterTag || p.tag === filterTag).sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));

  return (
    <div className="posts-panel">
      {tags.length > 0 && (
        <div className="tag-bar">
          <button className={`tag-button ${filterTag === "" ? "active-tag" : ""}`} onClick={() => onFilterChange("")}>All</button>
          {tags.map((t) => (
            <button key={t} className={`tag-button ${filterTag === t ? "active-tag" : ""}`} onClick={() => onFilterChange(t)}>{t}</button>
          ))}
        </div>
      )}
      <div className="posts-grid">
        {filtered.length === 0
          ? <p className="posts-empty">No posts yet.</p>
          : filtered.map((post) => <PostCard key={post.id} post={post} onClick={() => onSelect(post)} />)
        }
      </div>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="about-panel" style={{ padding: "1.75rem 2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", maxWidth: "720px", width: "100%" }}>
        <div style={{ width: 72, height: 72, flexShrink: 0, borderRadius: "50%", background: "linear-gradient(135deg, #00C2A8 0%, #006e60 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 700, color: "#0F0F0F", boxShadow: "0 0 24px rgba(0,194,168,0.3)" }}>K</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.3rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#EAEAEA" }}>Kyle Delacruz</h2>
            <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#00C2A8", letterSpacing: "0.08em" }}>Full-Stack Dev</span>
          </div>
          <p style={{ margin: "0 0 0.85rem", fontSize: "0.83rem", color: "#A0A0A0", lineHeight: 1.65 }}>
            I build web apps, tinker with side projects, and write about what's on my mind.
            This is the personal side — thoughts, interests, and whatever I feel like sharing.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {["💻 Coding", "🎵 Music", "🎮 Gaming", "🌿 Outdoors", "📖 Reading"].map(chip => (
              <span key={chip} style={{ fontSize: "0.72rem", padding: "0.2rem 0.65rem", borderRadius: "20px", background: "rgba(0,194,168,0.08)", border: "1px solid rgba(0,194,168,0.2)", color: "#A0A0A0" }}>{chip}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PowerIcon() {
  return (
    <span style={{ display: "block", width: 12, height: 12, borderRadius: "50%", border: "2px solid currentColor", borderTopColor: "transparent", position: "relative" }}>
      <span style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)", width: 2, height: 7, background: "currentColor", borderRadius: 1 }} />
    </span>
  );
}

export default function App() {
  const [auth, setAuth] = useState({ token: null, username: null, role: null });
  const [posts, setPosts] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [view, setView] = useState("about");
  const [filterTag, setFilterTag] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    setAuth({ token: null, username: null, role: null });
    setPosts([]);
    setView("about");
    setShowAuthModal(false);
    setShowRegister(false);
  };

  const handleFloatingButtonClick = () => {
    if (auth.token) {
      handleLogout();
    } else {
      setShowRegister(false);
      setShowAuthModal(true);
    }
  };

  const fetchPosts = () => {
    if (!auth.token) return;
    axios
      .get(`${API_BASE}/api/BlogAPI`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => setPosts(res.data.result))
      .catch((err) => console.error("Error fetching posts:", err));
  };

  useEffect(() => {
    if (!auth.token) return;
    fetchPosts();
    const id = setInterval(fetchPosts, 50000);
    return () => clearInterval(id);
  }, [auth.token]);

  if (!auth.token && view === "posts")
    return <LoginWrapper onLogin={(token, username, role) => { setAuth({ token, username, role }); setView("posts"); }} />;

  return (
    <div className="app-root">
      <header className="header">
        <h1 className="custom-text m-0">Kyle's Island</h1>
        <nav className="header-nav">
          <div className="header-nav-links">
            <button className={`custom-button ${view === "about" ? "active-button" : ""}`} onClick={() => setView("about")}>Professional</button>
            <button className={`custom-button ${view === "posts" ? "active-button" : ""}`} onClick={() => setView("posts")}>Personal</button>
          </div>
          <button
            title={auth.token ? `Logout (${auth.username})` : "Login"}
            onClick={handleFloatingButtonClick}
            style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${auth.token ? "var(--accent)" : "var(--text-secondary)"}`, background: auth.token ? "var(--accent-dim)" : "transparent", color: auth.token ? "var(--accent)" : "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", flexShrink: 0 }}
          >
            <PowerIcon />
          </button>
        </nav>
      </header>

      {view === "about" && <About />}

      {view === "posts" && (
        <div className="split-layout">
          <AboutPanel />
          <PostsPanel posts={posts} filterTag={filterTag} onFilterChange={setFilterTag} onSelect={setSelectedPost} />
        </div>
      )}

      {view === "posts" && auth.token && (
        <>
          <button className="floating-button" onClick={() => setShowNewPost(true)}>+</button>
          {showNewPost && (
            <NewPost token={auth.token} username={auth.username} role={auth.role} onClose={() => setShowNewPost(false)} onPostCreated={fetchPosts} />
          )}
        </>
      )}

      {showAuthModal && !auth.token && (
        <div className="post-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="post-modal-card" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <button className="post-modal-close" onClick={() => setShowAuthModal(false)}>✕</button>
            {showRegister ? (
              <Register onRegister={() => setShowRegister(false)} onSwitchToLogin={() => setShowRegister(false)} />
            ) : (
              <Login
                onLogin={(token, username, role) => { setAuth({ token, username, role }); setShowAuthModal(false); }}
                onSwitchToRegister={() => setShowRegister(true)}
              />
            )}
            <div style={{ marginTop: "0.75rem" }}>
              <button
                className="custom-button"
                style={{ width: "100%" }}
                onClick={async () => {
                  try {
                    const res = await fetch(`${API_BASE}/api/UserAuth/login`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ username: "Guest", password: "Guest" }),
                    });
                    if (!res.ok) throw new Error();
                    const data = await res.json();
                    setAuth({ token: data.result.token, username: data.result.user.userName, role: data.result.user.role });
                    setShowAuthModal(false);
                  } catch { console.error("Guest login failed"); }
                }}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          auth={auth}
          onPostDeleted={(deletedId) => {
            setPosts(prev => prev.filter(p => p.id !== deletedId));
            setSelectedPost(null);
            // No fetchPosts — let polling handle eventual sync
          }}
          onPostEdited={(updatedPost) => {
            setPosts(prev => prev.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p));
            setSelectedPost(null);
            // No fetchPosts — let polling handle eventual sync
          }}
        />
      )}
    </div>
  );
}