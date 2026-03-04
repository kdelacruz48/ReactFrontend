import { useEffect, useRef, useState } from "react";

// ─── Sample Data ───────────────────────────────────────────────────────────────

const SKILLS = [
  { label: "C# / .NET", level: 90 },
  { label: "Systems Architecture", level: 85 },
  { label: "JavaScript", level: 80 },
  { label: "SQL", level: 80 }, 
  { label: "HTML/CCS", level: 75},
  { label: "React", level: 50 },
];

const PROJECTS = [
  {
    name: "Blog Frontend",
    desc: "A dark, responsive React app with auth, tag filtering, post modals, and media embeds. Designed and built from scratch — no templates.",
    tags: ["React", "JavaScript", "CSS"],
    href: "https://github.com/kdelacruz48",
    implementation: [
      "Built with React and a custom CSS design system using CSS variables for the full dark theme.",
      "JWT auth, guest access, and a frosted-glass login screen that previews the real app.",
    ],
    improvements: [
      "Add a rich text editor so posts support markdown or formatted content.",
      "Introduce pagination or infinite scroll as the post count grows.",
    ],
  },
  {
    name: "Blog API",
    desc: "A containerized RESTful .NET Web API powering the blog — handling auth, post management, and role-based access control.",
    tags: ["C#", ".NET", "SQL Server", "Railway"],
    href: "https://github.com/kdelacruz48",
    implementation: [
      "ASP.NET Core Web API with JWT authentication and role-based authorization for admin actions.",
      "PostgreSQL Server database with Entity Framework Core, deployed alongside the API on Railway.",
    ],
    improvements: [
      "Add an image upload endpoint so media is hosted directly rather than relying on external URLs.",
      "Implement rate limiting and request logging for better observability in production.",
    ],
  },
];

const BLOG_IMPLEMENTATION = [
  { label: "Frontend", value: "React + Vite, custom CSS with dark theme variables" },
  { label: "Backend", value: "Containerized ASP.NET Core API with JWT authentication" },
  { label: "Database", value: "PostgreSQL — posts, users, and roles" },
  { label: "Auth", value: "Role-based: Admin can create posts, Guest can read" },
  { label: "Hosting", value: "React · .NET · PostgreSQL- Deployed on Railway" },
  { label: "Media", value: "Image URLs + embedded videos" },
];

const TIMELINE = [
  { year: "2019", text: "Made it official — started a Software Systems degree." },
  { year: "2021", text: "Graduated and jumped straight into production engineering. Learned fast." },
  { year: "2023", text: "Promoted to Systems Engineer. Took on architecture and bigger system-level problems." },
  { year: "2025", text: "Senior Systems Engineer. Still learning. Still shipping." },
];

const LINKS = [
  { label: "GitHub", href: "https://github.com/kdelacruz48", icon: "" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/k-delacruz/", icon: "" },
  { label: "Email", href: "mailto:k.delacruz48.kd@gmail.com", icon: "" },
];

const WHATS_NEXT = [
  { icon: "✍️", text: "Write more — the blog exists, now it needs posts" },
  { icon: "🖼️", text: "Add an image upload endpoint so posts aren't dependent on external URLs" },
  { icon: "🔒", text: "Rate limiting and request logging — the API is live and needs better observability" },
  { icon: "📄", text: "Rich text editor so posts can support formatted content, not just plain text" },
  { icon: "🔍", text: "Full-text search across posts — it'll matter once there are enough of them" },
];


const CURRENTLY = [
  { icon: "📖", label: "Reading",   value: "The Pragmatic Programmer" },
  { icon: "🎵", label: "Listening", value: "Motion City Soundtrack" },
  { icon: "🔨", label: "Building",  value: "This blog + A better future" },
  { icon: "📍", label: "Based in",  value: "United States" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function SkillBar({ label, level }) {
  const [filled, setFilled] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFilled(level); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [level]);

  return (
    <div ref={ref} style={{ marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.82rem", color: "#EAEAEA", fontFamily: "monospace", letterSpacing: "0.04em" }}>{label}</span>
        <span style={{ fontSize: "0.75rem", color: "#00C2A8" }}>{filled}%</span>
      </div>
      <div style={{ height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${filled}%`,
          background: "linear-gradient(90deg, #00C2A8, #00e5cc)",
          borderRadius: "4px",
          transition: "width 1.1s cubic-bezier(0.25, 1, 0.5, 1)",
          boxShadow: "0 0 8px rgba(0,194,168,0.5)",
        }} />
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        background: hovered ? "#2a2a2a" : "#1e1e1e",
        border: `1px solid ${hovered ? "rgba(0,194,168,0.5)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "12px",
        padding: "1.25rem 1.4rem",
        transition: "all 0.25s ease",
        boxShadow: hovered ? "0 6px 28px rgba(0,194,168,0.15)" : "none",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#EAEAEA" }}>{project.name}</span>
        <span style={{ fontSize: "0.85rem", color: "#00C2A8", opacity: hovered ? 1 : 0.4, transition: "opacity 0.2s" }}>↗</span>
      </div>

      <p style={{ fontSize: "0.82rem", color: "#A0A0A0", lineHeight: 1.6, margin: "0 0 0.85rem" }}>{project.desc}</p>

      {/* How it's built */}
      <div style={{
  background: "rgba(0,194,168,0.04)",
  border: "1px solid rgba(0,194,168,0.1)",
  borderRadius: "8px",
  padding: "0.65rem 0.85rem",
  marginBottom: "0.85rem",
}}>
  <span style={{ fontSize: "0.68rem", color: "#00C2A8", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
    How it's built
  </span>
  <ul style={{ margin: "0.4rem 0 0.75rem", padding: "0 0 0 1rem" }}>
    {project.implementation.map((point, i) => (
      <li key={i} style={{ fontSize: "0.79rem", color: "#A0A0A0", lineHeight: 1.6, marginBottom: i < project.implementation.length - 1 ? "0.25rem" : 0 }}>
        {point}
      </li>
    ))}
  </ul>

  {project.improvements && (
    <>
      <span style={{ fontSize: "0.68rem", color: "#00C2A8", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        What's next
      </span>
      <ul style={{ margin: "0.4rem 0 0", padding: "0 0 0 1rem" }}>
        {project.improvements.map((point, i) => (
          <li key={i} style={{ fontSize: "0.79rem", color: "#A0A0A0", lineHeight: 1.6, marginBottom: i < project.improvements.length - 1 ? "0.25rem" : 0 }}>
            {point}
          </li>
        ))}
      </ul>
    </>
  )}
</div>

      {/* Tags */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {project.tags.map(t => (
          <span key={t} style={{
            fontSize: "0.68rem",
            padding: "0.15rem 0.55rem",
            borderRadius: "20px",
            background: "rgba(0,194,168,0.1)",
            color: "#00C2A8",
            border: "1px solid rgba(0,194,168,0.2)",
            letterSpacing: "0.05em",
          }}>{t}</span>
        ))}
      </div>
    </a>
  );
}

function TimelineItem({ year, text, last }) {
  return (
    <div style={{ display: "flex", gap: "1.25rem", paddingBottom: last ? 0 : "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: "10px", height: "10px", borderRadius: "50%",
          background: "#00C2A8", boxShadow: "0 0 8px rgba(0,194,168,0.6)", flexShrink: 0,
        }} />
        {!last && <div style={{ width: "1px", flex: 1, background: "rgba(0,194,168,0.2)", marginTop: "4px" }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : "0.25rem" }}>
        <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#00C2A8", letterSpacing: "0.08em" }}>{year}</span>
        <p style={{ fontSize: "0.85rem", color: "#A0A0A0", lineHeight: 1.6, margin: "0.2rem 0 0" }}>{text}</p>
      </div>
    </div>
  );
}

function Section({ title, children, style = {} }) {
  return (
    <div style={{ marginBottom: "2.5rem", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#00C2A8", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {title}
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(0,194,168,0.15)" }} />
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AboutMe() {
  return (
    <div style={{
      background: "#0F0F0F",
      color: "#EAEAEA",
      fontFamily: "system-ui, sans-serif",
      padding: "3rem 1.5rem 5rem",
      overflowY: "auto",
    }}>

      {/* ── Hero ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto 3.5rem", textAlign: "center" }}>
        <div style={{
          width: 90, height: 90,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00C2A8 0%, #006e60 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.2rem", margin: "0 auto 1.25rem",
          boxShadow: "0 0 32px rgba(0,194,168,0.3)",
          fontWeight: 700, color: "#0F0F0F",
        }}>
          K
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0 0 0.35rem", letterSpacing: "-0.02em" }}>
          Kyle Delacruz
        </h1>
        <p style={{ fontSize: "1rem", color: "#00C2A8", margin: "0 0 1rem", letterSpacing: "0.08em", fontFamily: "monospace" }}>
          Engineer · Full-Stack Developer · Craftsman
        </p>
        <p style={{ fontSize: "1rem", color: "#A0A0A0", lineHeight: 1.75, maxWidth: "600px", margin: "0 auto 1.5rem" }}>
          I build things for the web — clean UIs, reliable APIs, and systems that hold everything together. I write about what I learn here.
        </p>
        <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap" }}>
          {LINKS.map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "0.0rem",
              padding: "0.4rem 1rem",
              border: "1px solid rgba(0,194,168,0.35)",
              borderRadius: "20px",
              fontSize: "0.8rem",
              color: "#00C2A8",
              textDecoration: "none",
              background: "rgba(0,194,168,0.05)",
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,194,168,0.15)"; e.currentTarget.style.borderColor = "#00C2A8"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,194,168,0.05)"; e.currentTarget.style.borderColor = "rgba(0,194,168,0.35)"; }}
            >
              <span style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── How This Blog Works — full width spotlight ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto 3rem" }}>
        <Section title="How This Blog Works">
          <div style={{
            background: "#1a1a1a",
            border: "1px solid rgba(0,194,168,0.2)",
            borderRadius: "14px",
            padding: "1.5rem 1.75rem",
            boxShadow: "0 0 40px rgba(0,194,168,0.05)",
          }}>
            <p style={{ fontSize: "0.88rem", color: "#A0A0A0", lineHeight: 1.75, margin: "0 0 1.25rem" }}>
              This blog is a full-stack project I built from scratch — it's the thing I'm most proud of so far.
              Here's a breakdown of how everything fits together:
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "0.6rem",
            }}>
              {BLOG_IMPLEMENTATION.map(row => (
                <div key={row.label} style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  padding: "0.65rem 0.85rem",
                }}>
                  <span style={{
                    fontSize: "0.68rem",
                    fontFamily: "monospace",
                    color: "#00C2A8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    minWidth: "68px",
                    paddingTop: "1px",
                  }}>{row.label}</span>
                  <span style={{ fontSize: "0.82rem", color: "#EAEAEA", lineHeight: 1.5 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* ── Two-column grid ── */}
      <div style={{
        maxWidth: "960px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
        gap: "2.5rem 3rem",
      }}>

        {/* Left col */}
        <div>
          <Section title="Skills">
            {SKILLS.map(s => <SkillBar key={s.label} {...s} />)}
          </Section>

          <Section title="Journey">
            {TIMELINE.map((item, i) => (
              <TimelineItem key={item.year} {...item} last={i === TIMELINE.length - 1} />
            ))}
          </Section>

         <Section title="Currently">
  <div style={{
    background: "#1e1e1e",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "1.1rem 1.3rem",
  }}>
    {CURRENTLY.map((row, i, arr) => (
      <div key={row.label} style={{
        display: "flex", alignItems: "baseline", gap: "0.6rem",
        padding: "0.5rem 0",
        borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
        fontSize: "0.85rem",
      }}>
        <span>{row.icon}</span>
        <span style={{ color: "#A0A0A0", minWidth: "72px" }}>{row.label}</span>
        <span style={{ color: "#EAEAEA" }}>{row.value}</span>
      </div>
    ))}
  </div>
</Section>
        </div>

        {/* Right col */}
        <div>
          <Section title="Projects">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {PROJECTS.map(p => <ProjectCard key={p.name} project={p} />)}
            </div>
          </Section>

          <Section title="What's Next">
            <div style={{
              background: "#1e1e1e",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "12px",
              padding: "1.1rem 1.3rem",
            }}>
              {WHATS_NEXT.map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                  padding: "0.55rem 0",
                  borderBottom: i < WHATS_NEXT.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                  <span style={{ fontSize: "0.83rem", color: "#A0A0A0", lineHeight: 1.6 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}