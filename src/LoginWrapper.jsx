import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

// Static fake data — always looks great, no loading flash
const FAKE_POSTS = [
  { id: 1, title: "Building a Blog with React & .NET", tag: "Tech", userName: "Kyle", created_date: "2025-01-15", post: "I recently finished building this blog from scratch using a React frontend and a .NET Web API on the backend. Here's what I learned along the way..." },
  { id: 2, title: "Why I Love Minimal Design", tag: "Art", userName: "Kyle", created_date: "2025-02-03", post: "There's something powerful about stripping everything back. No clutter, no noise — just the essential elements doing their job well." },
  { id: 3, title: "My Current Music Rotation", tag: "Music", userName: "Kyle", created_date: "2025-02-20", post: "Been deep in a lot of ambient and post-rock lately. Some albums have been on repeat for weeks and I can't get enough of them." },
  { id: 4, title: "Side Project: CLI Todo App", tag: "Projects", userName: "Kyle", created_date: "2025-03-01", post: "Wanted a dead-simple terminal todo list that didn't require an account or cloud sync. So I built one in a weekend." },
  { id: 5, title: "Thoughts on Remote Work", tag: "Life", userName: "Kyle", created_date: "2025-03-10", post: "Two years in and I still think the tradeoffs are worth it. Here are the routines and habits that have made it sustainable for me." },
  { id: 6, title: "Getting Started with TypeScript", tag: "Tech", userName: "Kyle", created_date: "2025-03-18", post: "I resisted TypeScript for a long time. Then I spent a day with it and couldn't imagine going back. Here's the mental shift that made it click." },
];

function MockPostCard({ post }) {
  const preview = post.post.length > 110
    ? post.post.slice(0, 110).trimEnd() + "…"
    : post.post;
  return (
    <div className="post-card" style={{ pointerEvents: "none", userSelect: "none" }}>
      <div className="post-card-header">
        <span className="post-card-tag">{post.tag}</span>
        <span className="post-card-date">
          {new Date(post.created_date).toLocaleDateString()}
        </span>
      </div>
      <h3 className="post-card-title">{post.title}</h3>
      <p className="post-card-preview">{preview}</p>
      <div className="post-card-footer">
        <span className="post-card-user">{post.userName}</span>
        <span className="post-card-read-more">Read more →</span>
      </div>
    </div>
  );
}

function MockBackground() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", pointerEvents: "none", userSelect: "none" }}>

      {/* Mock Header */}
      <div className="header">
        <h1 className="custom-text m-0">Kyle's Island</h1>
        <div>
          {["Professional", "Personal"].map((label) => (
            <button key={label} className="custom-button" style={{ pointerEvents: "none" }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Mock Split Layout */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

        {/* Mock About Panel */}
        <div style={{
          flex: "0 0 50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.75rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "linear-gradient(160deg, #141414 0%, #1a1a1a 100%)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", maxWidth: "720px", width: "100%" }}>

            {/* Avatar */}
            <div style={{
              width: 72, height: 72, flexShrink: 0,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00C2A8 0%, #006e60 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.8rem", fontWeight: 700, color: "#0F0F0F",
              boxShadow: "0 0 24px rgba(0,194,168,0.3)",
            }}>K</div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.3rem" }}>
                <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#EAEAEA" }}>Kyle De La Cruz</h2>
                <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#00C2A8", letterSpacing: "0.08em" }}>Full-Stack Dev</span>
              </div>
              <p style={{ margin: "0 0 0.85rem", fontSize: "0.83rem", color: "#A0A0A0", lineHeight: 1.65 }}>
                By day I write code, by night I'm painting or performing on the street.
                This is the personal side — thoughts, interests, and whatever I feel like sharing.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {["💻 Coding", "🎨 Painting", "🎭 Street Performance", "🎵 Music", "📖 Reading"].map(chip => (
                  <span key={chip} style={{
                    fontSize: "0.72rem", padding: "0.2rem 0.65rem", borderRadius: "20px",
                    background: "rgba(0,194,168,0.08)", border: "1px solid rgba(0,194,168,0.2)", color: "#A0A0A0",
                  }}>{chip}</span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Mock Posts Panel */}
        <div style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="tag-bar">
            {["All", "Tech", "Art", "Music", "Life", "Projects"].map((t) => (
              <button key={t} className={`tag-button ${t === "All" ? "active-tag" : ""}`} style={{ pointerEvents: "none" }}>{t}</button>
            ))}
          </div>
          <div style={{
            flex: 1,
            overflow: "hidden",
            padding: "0.5rem 1.5rem 1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "0.85rem",
            alignContent: "start",
          }}>
            {FAKE_POSTS.map((post) => (
              <MockPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginWrapper({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);

  const handleGuestLogin = async () => {
    try {
      const res = await fetch(
        "https://blogapi-production-97d7.up.railway.app/api/UserAuth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "Guest", password: "Guest" }),
        }
      );
      if (!res.ok) throw new Error("Guest login failed");
      const data = await res.json();
      onLogin(data.result.token, data.result.user.userName, data.result.user.role);
    } catch (err) {
      console.error("Guest login failed", err);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>

      {/* ── Blurred full-layout mockup in the background ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        filter: "blur(5px) brightness(0.4)",
        WebkitFilter: "blur(5px) brightness(0.4)",
        pointerEvents: "none",
        userSelect: "none",
      }}>
        <MockBackground />
      </div>

      {/* ── Login form floating on top ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}>
        <div style={{
          background: "rgba(15, 15, 15, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(0, 194, 168, 0.2)",
          borderRadius: "16px",
          padding: "2rem",
          width: "100%",
          maxWidth: "380px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,194,168,0.08)",
        }}>
          {showRegister ? (
            <Register
              onRegister={() => setShowRegister(false)}
              onSwitchToLogin={() => setShowRegister(false)}
            />
          ) : (
            <Login
              onLogin={onLogin}
              onSwitchToRegister={() => setShowRegister(true)}
            />
          )}

          <div className="text-center mt-3">
            <button
              className="custom-button"
              style={{ width: "100%" }}
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}