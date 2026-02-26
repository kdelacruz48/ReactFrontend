import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import LoginWrapper from "./LoginWrapper";
import NewPost from "./NewPost";
import "./App.css";
import API_BASE from "./API";

const TRUNCATE_LENGTH = 120;

function getImageUrl(post) {
  return post.imageUrl;
}

function getMediaType(url) {
  if (!url) return null;
  const clean = url.split("?")[0].toLowerCase();
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/vimeo\.com/.test(url)) return "vimeo";
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

function PostModal({ post, onClose }) {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="post-modal-overlay" onClick={onClose}>
      <div className="post-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="post-modal-close" onClick={onClose}>✕</button>
        <span className="post-modal-tag">{post.tag}</span>
        <h2 className="post-modal-title">{post.title}</h2>
        <p className="post-modal-meta">{post.userName} · {new Date(post.created_date).toLocaleDateString()}</p>
        <div className="post-modal-divider" />
        {getImageUrl(post) && <ModalMedia url={getImageUrl(post)} />}
        <p className="post-modal-content">{post.post}</p>
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
      <span className="post-card-date">{new Date(post.created_date).toLocaleDateString()}</span>
    </div>
    <h3 className="post-card-title">{post.title}</h3>
    <p className="post-card-preview">{preview}</p>
  </div>
  <div className="post-card-footer">
    <span className="post-card-user">{post.userName}</span>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {hasMedia && <CardMediaBadge url={getImageUrl(post)} />}
      {isLong && <span className="post-card-read-more">Read more →</span>}
    </div>
  </div>
</div>
    </div>
  );
}

function PostsPanel({ posts, filterTag, onFilterChange, onSelect }) {
 const tags = [...new Set(posts.map((p) => p.tag))].sort();
  const filtered = [...posts].filter((p) => !filterTag || p.tag === filterTag).reverse();

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
    <div className="about-panel">
      <div className="about-inner">
        <h2 className="about-title">About Me</h2>
        <p className="about-body">Hello! I'm Kyle. This is my personal blog where I share posts about general topics. I enjoy coding, building small projects, and sharing my experiences.</p>
        <p className="about-body">More info, hobbies, or links could go here!</p>
      </div>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState({ token: null, username: null, role: null });
  const [posts, setPosts] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [view, setView] = useState("about");
  const [filterTag, setFilterTag] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  const handleLogout = () => {
    setAuth({ token: null, username: null, role: null });
    setPosts([]);
    setView("about");
  };

const fetchPosts = useCallback(() => {
    axios
      .get(`${API_BASE}/api/BlogAPI`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => setPosts(res.data.result))
      .catch((err) => console.error("Error fetching posts:", err));
  }, [auth.token]);

 useEffect(() => {
    if (!auth.token) return;
    fetchPosts();
    const id = setInterval(fetchPosts, 60000);
    return () => clearInterval(id);
  }, [auth.token, fetchPosts]);

  if (!auth.token && view === "posts")
    return <LoginWrapper onLogin={(token, username, role) => setAuth({ token, username, role })} />;

  return (
    <div className="app-root">
      <header className="header">
        <h1 className="custom-text m-0">Kyle's Island</h1>

        <nav className="header-nav">
          {/* Main nav links */}
          <div className="header-nav-links">
            <button className={`custom-button ${view === "about" ? "active-button" : ""}`} onClick={() => setView("about")}>About Me</button>
            <button className={`custom-button ${view === "posts" ? "active-button" : ""}`} onClick={() => setView("posts")}>Posts</button>
            <a href="https://github.com/kdelacruz48" target="_blank" rel="noreferrer" className="custom-button" style={{ textDecoration: "none", display: "inline-block" }}>GitHub</a>
            <a href="https://www.linkedin.com/in/k-delacruz/" target="_blank" rel="noreferrer" className="custom-button" style={{ textDecoration: "none", display: "inline-block" }}>LinkedIn</a>
          </div>

          {/* User section — only when logged in */}
          {auth.token && (
            <div className="header-user">
              <span className="header-username">{auth.username}</span>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </nav>
      </header>

      {view === "about" ? (
        <div className="container p-4">
          <div className="card about-card">
            <h2 className="subtitle text-accept mb-3" style={{ textAlign: "center" }}>About Me</h2>
            <p>Hello! I'm Kyle. This is my personal blog where I share posts about general topics.</p>
            <p>I enjoy coding, building small projects, and sharing my experiences.</p>
            <p>More info, hobbies, or links could go here!</p>
          </div>
        </div>
      ) : (
        <div className="split-layout">
          <AboutPanel />
          <PostsPanel posts={posts} filterTag={filterTag} onFilterChange={setFilterTag} onSelect={setSelectedPost} />
        </div>
      )}

      {view === "posts" && (
        <>
          <button className="floating-button" onClick={() => setShowNewPost(true)}>+</button>
          {showNewPost && (
            <NewPost token={auth.token} username={auth.username} role={auth.role} onClose={() => setShowNewPost(false)} onPostCreated={fetchPosts} />
          )}
        </>
      )}

      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
}