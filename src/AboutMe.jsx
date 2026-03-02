import { useEffect, useRef, useState } from "react";

// ─── Sample Data ───────────────────────────────────────────────────────────────

const SKILLS = [
  { label: "React", level: 90 },
  { label: "JavaScript", level: 88 },
  { label: "C# / .NET", level: 80 },
  { label: "SQL", level: 72 },
  { label: "CSS / Tailwind", level: 85 },
  { label: "Node.js", level: 65 },
];

const PROJECTS = [
  {
    name: "CLI Todo App",
    desc: "A dead-simple terminal-based todo list — no cloud, no accounts, just fast local task tracking.",
    tags: ["Node.js", "CLI"],
    href: "https://github.com/kdelacruz48",
    implementation: [
      "Built with Node.js and a plain JSON file as the data store — no database needed.",
      "Commands parsed with a lightweight argv handler; no external CLI frameworks.",
    ],
  },
  {
    name: "Portfolio Site",
    desc: "Minimal dark portfolio showcasing my work, skills, and writing. Designed from scratch, no templates.",
    tags: ["HTML", "CSS", "JS"],
    href: "https://github.com/kdelacruz48",
    implementation: [
      "Pure HTML/CSS/JS — zero build step, zero dependencies, loads instantly.",
      "Dark theme implemented with CSS custom properties for easy future retheming.",
    ],
  },
];

const BLOG_IMPLEMENTATION = [
  { label: "Frontend", value: "React + Vite, custom CSS with dark theme variables" },
  { label: "Backend", value: "ASP.NET Core Web API with JWT authentication" },
  { label: "Database", value: "SQL Server — posts, users, and roles" },
  { label: "Auth", value: "Role-based: Admin can create posts, Guest can read" },
  { label: "Hosting", value: "API deployed on Railway; frontend on Vercel" },
  { label: "Media", value: "Image URLs + embedded YouTube/Vimeo via iframe" },
];

const TIMELINE = [
  { year: "2023", text: "Started learning full-stack development with React and .NET." },
  { year: "2024", text: "Shipped my first production web app and began freelancing." },
  { year: "2025", text: "Built this blog. Currently exploring TypeScript and cloud infra." },
];

const LINKS = [
  { label: "GitHub", href: "https://github.com/kdelacruz48", icon: "" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/k-delacruz/", icon: "" },
  { label: "Email", href: "mailto:k.delacruz48.kd@gmail.com", icon: "" },
];

const WHATS_NEXT = [
  { icon: "⚙️", text: "Migrate the blog API to TypeScript + Bun for faster cold starts" },
  { icon: "🔍", text: "Add full-text search across posts" },
  { icon: "💬", text: "Comments system — probably with a lightweight serverless function" },
  { icon: "🌐", text: "Explore containerizing the API with Docker + Railway deploy hooks" },
  { icon: "📝", text: "Write more — aiming for at least one post per week" },
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

      {/* Implementation details */}
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
        <ul style={{ margin: "0.4rem 0 0", padding: "0 0 0 1rem" }}>
          {project.implementation.map((point, i) => (
            <li key={i} style={{ fontSize: "0.79rem", color: "#A0A0A0", lineHeight: 1.6, marginBottom: i < project.implementation.length - 1 ? "0.25rem" : 0 }}>
              {point}
            </li>
          ))}
        </ul>
      </div>

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
          Full-Stack Developer · Builder · Writer
        </p>
        <p style={{ fontSize: "1rem", color: "#A0A0A0", lineHeight: 1.75, maxWidth: "600px", margin: "0 auto 1.5rem" }}>
          I build things for the web — clean UIs, reliable APIs, and occasionally useful CLI tools. I write about what I learn here.
        </p>
        <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap" }}>
          {LINKS.map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
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
              {[
                { icon: "📖", label: "Reading", value: "The Pragmatic Programmer" },
                { icon: "🎵", label: "Listening", value: "Explosions in the Sky" },
                { icon: "🔨", label: "Building", value: "This blog + TypeScript deep dive" },
                { icon: "📍", label: "Based in", value: "United States" },
              ].map((row, i, arr) => (
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
          <Section title="Other Projects">
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