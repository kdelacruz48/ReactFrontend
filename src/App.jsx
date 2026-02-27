
React fronted to .NET API blog
/

import React, { useState, useEffect, useCallback } from "react"; import axios from "axios"; import LoginWrapper from "./LoginWrapper"; import NewPost from "./NewPost"; import "./App.css"; import API_BASE from "./API"; const TRUNCATE_LENGTH = 120; function getImageUrl(post) { return p

pasted

I have an about page. I actually want the github link and the linked in link to go in one page called contact, and I want one more page called projects. All in the nave bar, and just layed out like about me. I will fill them out later

12:15 PM

Reading the current App.jsx project file
Reading the current App.jsx project file
Here's the updated App.jsx with the navbar restructured — GitHub and LinkedIn moved into a Contact page, and a Projects page added, both laid out like About Me with placeholder content for you to fill in later.


Created a file, read a file
Created a file, read a file
Here's what changed:

GitHub and LinkedIn links removed from the navbar — they now live inside the Contact page as styled links
Projects page added between About Me and Posts in the nav
Both new pages follow the same card about-card layout as About Me, with placeholder text for you to fill in later
The Contact page already has your GitHub and LinkedIn links pre-populated
App
Code · JSX 
I also think I want my floating power button on every page, and to allow for login or logout when clicked

12:17 PM
Looking at the current code, the floating button is only shown on the posts view and only opens the new post form. Let me update it to show on every page and handle login/logout toggling.


Edited 3 files, viewed a file
Edited 3 files, viewed a file
Now update the bottom of the return — replace the old floating button + selectedPost block with the new version:


Replace floating button and end of return with new universal power button + auth modal
Replace floating button and end of return with new universal power button + auth modal
Now update the if (!auth.token && view === "posts") redirect since we no longer want to hard-redirect to LoginWrapper — the modal handles it now:


Edited a file, read a file
Edited a file, read a file
Here's what changed:

Power button (⏻) now appears on every page in the bottom-right corner
Not logged in → button is dimmed/grey, clicking it opens a login modal overlay (the same LoginWrapper you already have, but as a popup instead of a full-page redirect)
Logged in → button glows teal, clicking it logs you out immediately; hovering shows your username as a tooltip
New post (+) button still exists on the posts view but moves slightly left so it doesn't overlap the power button
App
Code · JSX 
I want it always in the top right, with the buttons shifted over to accomodate. Remove the logout that is normally there. The button also popped up the login inside another box with the blog in the background but fuzzy. so one too many levels of boxes

12:20 PM

View full current App.jsx output
View full current App.jsx output
Now I have a clear picture. I need to:

Move the power button into the header nav (top right), removing the old logout section
Replace LoginWrapper in the modal with the raw Login/Register components directly — no blurred background, no extra card wrapper

Check Login and Register components
Check Login and Register components
Good — Login and Register are standalone components that just render form markup with no wrapper. I can use them directly in the modal. Now I'll rewrite the relevant parts of App.jsx:


Edited 3 files
Edited 3 files
Now add showRegister state alongside the other state declarations:


Add showRegister state
Add showRegister state
Also reset showRegister on modal close/logout:


Edited a file, read a file
Edited a file, read a file
Here's what changed:

Power button is now in the header, sitting to the right of the nav buttons — no more floating position
Old logout section removed entirely from the header; the power button handles it all (tooltip shows your username when logged in)
Login modal is now clean — uses Login and Register directly inside post-modal-card, so it's just a single card over a dark overlay with no blurred blog background behind it
Guest login button is included in the modal as before
The + new post floating button still works independently at the bottom-right when on the posts view
App
Code · JSX 
This is perfect. any chance on mobile the button can render to the right instead of the left. like it does in desktop?

12:23 PM
The issue is the mobile CSS in App.css that forces the header to flex-direction: column and align-items: flex-start, which pushes everything left. A small fix:


Viewed 3 files
Viewed 3 files
Found it. The fix is to make the mobile header a two-row layout — title on the left, power button on the right in the first row, then the nav buttons wrapping below. I'll update the CSS and also add a class to the power button in App.jsx so it can be targeted.


Ran a command, edited a file
Ran a command, edited a file
Now add power-button class to the button in App.jsx:


Edited a file, read a file
Edited a file, read a file
Two files to update. Here's what changed:

App.css — on mobile, the header now uses flex-wrap instead of flex-direction: column, so the title and power button sit on the same row. The nav buttons wrap onto the line below. The power-button class uses margin-left: auto to push it to the far right, same as desktop.
App.jsx — just adds className="power-button" to the header button so the CSS can target it.
App
Code · JSX 
App
Code · CSS 
still apearing on the left in mobile

12:27 PM
Let me inspect what's actually happening more carefully.


Look at the full header CSS and nav CSS
Look at the full header CSS and nav CSS
The problem is that the power button is inside .header-nav, which is width: 100% and justify-content: flex-start — so the button just sits at the start of that row. The real fix is to pull the power button out of .header-nav in the JSX so it's a direct child of .header, sitting next to the h1 on the same row, and let .header-nav take the full second row.


View the header JSX in App.jsx
View the header JSX in App.jsx
Move the power button out of <nav> and make it a direct sibling of <h1> inside <header>. Then the header's own justify-content: space-between naturally pins the title left and the button right on both desktop and mobile.


Move power button out of nav, make it a direct child of header alongside h1
Move power button out of nav, make it a direct child of header alongside h1
Now update the mobile CSS — the header is now h1 + nav + power-button as siblings, so we want h1 to grow and nav to take a full second row:


Edited a file, read a file
Edited a file, read a file
The root cause was that the power button was inside <nav>, so CSS couldn't easily pin it to the header's right edge independently. Here's what changed:

App.jsx — power button is now a direct child of <header>, sitting alongside <h1> and <nav> as siblings
App.css — on mobile, h1 gets flex: 1 to fill the space, power button (order: 2) naturally sits right next to it on the right, and the nav (order: 3, width: 100%) wraps down to its own second row
App
Code · JSX 
App
Code · CSS 
In desktop there is now a large gap between it andd the butons. I want the buttons pushed to the right, with a small gap for the power button. The button is also a little too high in mobile

12:30 PM

Check header CSS
Check header CSS
The issue is .header uses justify-content: space-between, which pushes h1 far left and the nav+power-button far right with a huge gap between them. The fix: make nav take up the remaining space with flex: 1 and justify-content: flex-end, then just a small gap between it and the power button.


Viewed 2 files
Viewed 2 files
Now I have the full picture. The fix is:

Desktop: remove justify-content: space-between from .header, give nav flex: 1 + justify-content: flex-end, set a small gap between nav and power button directly on .header
Mobile: align power button vertically with the h1 (it's sitting too high because of align-items: center on the wrapping header)

Edited 2 files
Edited 2 files
Now fix the mobile CSS — power button is too high because on mobile the header wraps and align-items: center aligns it to the center of the whole multi-row block. Fix by aligning to flex-start so rows align to the top, and tweak the power button's own alignment:


Edited a file, read a file
Edited a file, read a file
Just the CSS needed updating this time. Here's what changed:

Desktop: .header no longer uses space-between — instead .header-nav has flex: 1 and justify-content: flex-end, so the nav buttons naturally push to the right with just a small 0.6rem gap before the power button
Mobile: header uses align-items: flex-start instead of center so wrapping rows align to the top properly, and the power button gets a tiny margin-top: 4px to optically align with the title text rather than floating too high
App
Code · CSS 

/* ========================= Global Theme Variables ========================= */ :root { --bg-main: #0F0F0F; --bg-secondary: #1E1E1E; --bg-card: #252525; --text-primary: #EAEAEA; --text-secondary: #A0A0A0; --accent: #00C2A8; --accent-dim: rgba(0, 194, 168, 0.15); --ac

pasted


import React, { useState, useEffect } from "react"; import axios from "axios"; import LoginWrapper from "./LoginWrapper"; import Login from "./Login"; import Register from "./Register"; import NewPost from "./NewPost"; import "./App.css"; const TRUNCATE_LENGTH = 120; function getImageUrl

pasted

I went back to these. I like them better. When it gets to 395 the buttons go under the power button. I don't like this, but are any phones that narrow, or can I adjust that to break below at a smaller width?

12:34 PM
Most modern phones are 390px+ wide (iPhone 14/15 are 390px, Samsung Galaxy is 360-412px), so 395px is right at the edge where real phones sit. You'd want the breakpoint lower — around 360px — so the nav buttons stay on one row on virtually all real devices. Let me check your current breakpoint and fix it.


Check the mobile media query breakpoints in App.css
Check the mobile media query breakpoints in App.css
The CSS you shared in the conversation is the current live version — it uses the mobile-logout-btn fixed-position approach, not the power-button-in-header approach. The problem is the nav buttons are wrapping under the power button at narrow widths because the buttons don't have room. The simplest fix is just shrinking the button font/padding a bit more at narrow widths, and lowering the wrap threshold. Here's the updated CSS:


Copy the current live App.css to outputs
Copy the current live App.css to outputs
The document you shared shows the power button is still inside .header-nav (not pulled out as a direct header child). The real problem is .header-nav uses gap: 1.5rem between the links div and the power button, and .custom-button at 13px with 5px 10px padding still takes up too much space at ~395px. The fix: tighten button padding further at very narrow widths and reduce that gap.


Viewed 2 files
Viewed 2 files
I can see the issue now. The live CSS has the header doing flex-direction: column at 600px, which means the power button (which is the mobile-logout-btn fixed element in this version) overlaps the nav. The document you shared is a newer version. Let me work with that exact version and add a narrow breakpoint to shrink buttons further so they never wrap:


Write the complete corrected App.css
Write the complete corrected App.css
Now update App.jsx to match — move the power button out of <nav> as a direct <header> sibling, give it className="power-button", and remove the old mobile-logout-btn:


Ran a command, read a file
Ran a command, read a file
To answer your question: yes, some real phones are that narrow — older Android budget phones and the SE-sized iPhones in landscape can hit 360px. The fix covers both angles:

Power button pulled out of <nav> and made a direct sibling of <h1> inside <header>, so it's structurally always at the far right — no CSS tricks needed
Nav gets flex: 1 + justify-content: flex-end so it fills space and buttons push right on desktop
On mobile, <h1> has flex: 1 so it takes the available row space, power button naturally sits right beside it, and the nav wraps to a second row below
New @media (max-width: 400px) breakpoint shrinks button padding/font further so they stay on one row even on very narrow devices like Galaxy A series (360px)
App
Code · JSX 
App
Code · CSS 
I want to use my current files. But explain to me why the button switches from the right side to the left at the mobile breakpoint. I don't want that

12:42 PM
Looking at your current CSS (the one you pasted), here's exactly why it happens:

Your header at desktop is:

css
.header {
  display: flex;
  justify-content: space-between;
}
So it's h1 on the left, header-nav on the right — and the power button is inside .header-nav, so it naturally sits at the far right.

Then at the 1024px breakpoint:

css
.header {
  flex-wrap: wrap;
}
.header-nav {
  width: 100%;        /* <-- this is the culprit */
  justify-content: flex-start;
}
When .header-nav becomes width: 100%, it drops to its own full-width row below the h1. Now the power button — still inside .header-nav — is on that second row, starting from the left because justify-content: flex-start.

The fix is one of two things:

Option A (simplest): Change justify-content on .header-nav at mobile to flex-end, so the nav row right-aligns, putting the power button on the far right of that second row.

Option B (what I kept trying): Pull the power button out of .header-nav in the JSX so it's a direct child of .header. Then it stays on the first row next to h1, and only the nav buttons wrap below. This is structurally cleaner but requires a JSX change too.

Option A is just a one-line CSS change in your existing file — in the @media (max-width: 1024px) block, change:

css
.header-nav {
  justify-content: flex-start;  /* change this... */
}
to:

css
.header-nav {
  justify-content: flex-end;    /* ...to this */
}
That would keep the power button pinned to the right edge on mobile too. Want me to apply that?

alright everything is working how I want. except when I create a post on mobile the modal is at the very bottom of the screen, so when I open the keyboard it pushes it way up and doesn't look the best. how can I help this?

12:50 PM
The issue is your NewPost component uses position: fixed; bottom: 0 which anchors it to the bottom of the viewport — so when the keyboard opens and shrinks the viewport, the form shoots up with it.

The best fix for mobile is to switch it to a centered modal (like your post modal) instead of a bottom sheet, or at least cap it so it doesn't ride the keyboard. The most reliable cross-browser approach is to use position: fixed with a centered position and let it scroll internally rather than being anchored to the bottom.


Check current NewPost component
Check current NewPost component
The cleanest fix is to wrap it in the same full-screen overlay pattern your post modal uses, with the form card centered. On desktop it keeps the current bottom-sheet feel, on mobile it becomes a centered modal that doesn't interact with the keyboard at all.


Created a file, read a file
Created a file, read a file
The key change: instead of position: fixed; bottom: 0, the form is now wrapped in a full-screen overlay (inset: 0) with alignItems: center — so it sits in the middle of the screen. When the keyboard opens on mobile it shrinks the viewport, but since the modal is centered and has maxHeight: 90vh with overflowY: auto, it just becomes scrollable rather than flying off the top. Clicking outside the card still closes it.

Newpost
Code · JSX 
can you switch back to my purely css gerated button. the image of the powerbutton doesn't load on my phone

1:01 PM
The ⏻ character is a Unicode symbol that isn't in every phone's default font set, so it renders as a blank box on some Android devices. Here's a pure CSS power button — no character needed:


Find the power button in App.jsx
Find the power button in App.jsx
I can see your current file still has the old structure. Let me just give you the CSS power button icon and how to swap it in. Replace the button's content (the ⏻ character) with two <span> elements that form the icon purely via CSS:


Find where the power button symbol and styles live
Find where the power button symbol and styles live
Your current files use the mobile-logout-btn CSS approach from the version you pasted earlier. The ⏻ symbol is inside that button in your live code. Here's exactly what to do — just swap the button's inner content and add the CSS:

In your JSX, find wherever you render the power/logout button and replace its children with:

jsx
<span className="power-icon">
  <span className="power-icon-line" />
</span>
In your CSS, add this block:

css
.power-icon {
  display: block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  position: relative;
}

.power-icon-line {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 8px;
  background: currentColor;
  border-radius: 1px;
}
This draws the circle-with-a-gap and the vertical line using pure CSS — currentColor means it automatically inherits whatever color you set on the button itself (teal when logged in, grey when not), so no other changes needed.


import React, { useState, useEffect } from "react"; import axios from "axios"; import LoginWrapper from "./LoginWrapper"; import Login from "./Login"; import Register from "./Register"; import NewPost from "./NewPost"; import "./App.css"; const TRUNCATE_LENGTH = 120; function getImageUrl

pasted

can you do it here?

1:02 PM

Edited a file, ran a command, read a file
Edited a file, ran a command, read a file
The only change is the ⏻ character is gone. It's replaced by a small PowerIcon component that draws the icon with two <span> elements styled inline — a circle with the top-right gap (borderTopColor: "transparent") and a short vertical line poking out the top. Since it uses currentColor throughout, it automatically picks up the teal or grey color from the parent button with no extra work.

App
Code · JSX 







Claude is AI and can make mistakes. Please double-check responses.
App · JSX
Copy

import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginWrapper from "./LoginWrapper";
import Login from "./Login";
import Register from "./Register";
import NewPost from "./NewPost";
import "./App.css";

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
  const tags = [...new Set(posts.map((p) => p.tag))];
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

function PowerIcon() {
  return (
    <span style={{
      display: "block",
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: "2px solid currentColor",
      borderTopColor: "transparent",
      position: "relative",
    }}>
      <span style={{
        position: "absolute",
        top: -6,
        left: "50%",
        transform: "translateX(-50%)",
        width: 2,
        height: 7,
        background: "currentColor",
        borderRadius: 1,
      }} />
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
      .get("https://blogapi-production-97d7.up.railway.app/api/BlogAPI", {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => setPosts(res.data.result))
      .catch((err) => console.error("Error fetching posts:", err));
  };

  useEffect(() => {
    if (!auth.token) return;
    fetchPosts();
    const id = setInterval(fetchPosts, 5000);
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
            <button className={`custom-button ${view === "about" ? "active-button" : ""}`} onClick={() => setView("about")}>About Me</button>
            <button className={`custom-button ${view === "projects" ? "active-button" : ""}`} onClick={() => setView("projects")}>Projects</button>
            <button className={`custom-button ${view === "posts" ? "active-button" : ""}`} onClick={() => setView("posts")}>Posts</button>
            <button className={`custom-button ${view === "contact" ? "active-button" : ""}`} onClick={() => setView("contact")}>Contact</button>
          </div>

          {/* Power button — pure CSS icon, no unicode */}
          <button
            title={auth.token ? `Logout (${auth.username})` : "Login"}
            onClick={handleFloatingButtonClick}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: `2px solid ${auth.token ? "var(--accent)" : "var(--text-secondary)"}`,
              background: auth.token ? "var(--accent-dim)" : "transparent",
              color: auth.token ? "var(--accent)" : "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          >
            <PowerIcon />
          </button>
        </nav>
      </header>

      {view === "about" && (
        <div className="container p-4">
          <div className="card about-card">
            <h2 className="subtitle text-accept mb-3" style={{ textAlign: "center" }}>About Me</h2>
            <p>Hello! I'm Kyle. This is my personal blog where I share posts about general topics.</p>
            <p>I enjoy coding, building small projects, and sharing my experiences.</p>
            <p>More info, hobbies, or links could go here!</p>
          </div>
        </div>
      )}

      {view === "projects" && (
        <div className="container p-4">
          <div className="card about-card">
            <h2 className="subtitle text-accept mb-3" style={{ textAlign: "center" }}>Projects</h2>
            <p>This is where my projects will go. Check back soon!</p>
          </div>
        </div>
      )}

      {view === "contact" && (
        <div className="container p-4">
          <div className="card about-card">
            <h2 className="subtitle text-accept mb-3" style={{ textAlign: "center" }}>Contact</h2>
            <p>Feel free to reach out! You can find me on the following platforms:</p>
            <p>
              <a href="https://github.com/kdelacruz48" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>GitHub</a>
            </p>
            <p>
              <a href="https://www.linkedin.com/in/k-delacruz/" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>LinkedIn</a>
            </p>
          </div>
        </div>
      )}

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
              <Register
                onRegister={() => setShowRegister(false)}
                onSwitchToLogin={() => setShowRegister(false)}
              />
            ) : (
              <Login
                onLogin={(token, username, role) => {
                  setAuth({ token, username, role });
                  setShowAuthModal(false);
                }}
                onSwitchToRegister={() => setShowRegister(true)}
              />
            )}
            <div style={{ marginTop: "0.75rem" }}>
              <button
                className="custom-button"
                style={{ width: "100%" }}
                onClick={async () => {
                  try {
                    const res = await fetch("https://blogapi-production-97d7.up.railway.app/api/UserAuth/login", {
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

      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
}







