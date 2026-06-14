import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  Github,
  ExternalLink,
  Lock,
  X,
  Plus,
  Pencil,
  Trash2,
  Mail,
  ArrowUpRight,
  Check,
  Unlock,
  Linkedin,
  Briefcase,
  Upload,
  Code2,
  MapPin,
} from "lucide-react";

/* ============================================================
   Supabase config
   ============================================================ */
const SUPABASE_URL = "https://okegmojykujvxptwndyf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZWdtb2p5a3VqdnhwdHduZHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MTc0OTQsImV4cCI6MjA5Njk5MzQ5NH0.DgyJVHo14PbpY5Y10Sr44-y-NPxRLved7w9eNKlPNC4";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const STORAGE_BUCKET = "portfolio-images";

/* Accent presets — warm cinematic tones for project covers */
const ACCENTS = [
  ["#d2a679", "#8a5226"],
  ["#c0673a", "#5e2418"],
  ["#b08d57", "#5a3a1f"],
  ["#a8743f", "#43210f"],
  ["#9c6b4a", "#33180d"],
  ["#caa06a", "#7a3f1c"],
];

/* ============================================================
   Default content — everything below is editable in /admin
   ============================================================ */
const DEFAULT_CONTENT = {
  profile: {
    name: "Aria Suk",
    roles: ["Full-Stack Developer", "UI Engineer", "Creative Coder"],
    headline: "Full-Stack Developer & UI Engineer",
    tagline:
      "Available for freelance projects worldwide.",
    about:
      "My work spans the full stack — from polished interfaces to the systems that power them. I have built products for startups, agencies, and open-source communities, shipping experiences used by thousands of people.",
    aboutMore:
      "Born and raised in Bangkok, I discovered programming at fifteen and never looked back. My journey began with side projects, leading to roles at fast-growing teams where I learned to build things that last. I care about craft, clarity, and code that future-me will thank present-me for.",
    location: "Bangkok, TH",
    years: "5+",
    nominations: "12",
    avatarAbout: "",
    avatar: "data:image/jpeg;base64,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",
  },
  contact: {
    email: "hello@example.com",
    github: "https://github.com/yourname",
    linkedin: "https://linkedin.com/in/yourname",
  },
  highlights: [
    { id: "h1", text: "Best Hackathon Project, TechCrunch Disrupt (2024)" },
    { id: "h2", text: "Open-Source Contributor of the Year, GitHub Stars (2023)" },
    { id: "h3", text: "Featured Developer, Awwwards (2022)" },
    { id: "h4", text: "Speaker, React Conf Asia (2023)" },
  ],
  skills: [
    "React", "TypeScript", "Next.js", "Node.js", "Tailwind",
    "GraphQL", "PostgreSQL", "Three.js", "Python", "Docker",
    "Figma", "AWS", "Redis", "Framer Motion",
  ],
  experience: [
    {
      id: "e1",
      role: "Senior Frontend Developer",
      company: "Pixelmint Studio",
      period: "2023 — Present",
      description:
        "Lead the web team building design-system-driven products. Shipped a component library now used across 6 apps.",
    },
    {
      id: "e2",
      role: "Full-Stack Developer",
      company: "Nimbus Labs",
      period: "2021 — 2023",
      description:
        "Built realtime dashboards and internal tools with React, Node, and PostgreSQL for a fast-growing startup.",
    },
    {
      id: "e3",
      role: "Junior Developer",
      company: "Freelance",
      period: "2020 — 2021",
      description:
        "Designed and developed websites for small businesses, learning the full path from brief to launch.",
    },
  ],
  projects: [
    {
      id: "p1",
      title: "Nebula Dashboard",
      description:
        "A real-time analytics dashboard with animated charts, custom widgets, and a drag-and-drop layout engine.",
      tags: ["React", "TypeScript", "D3"],
      category: "Web App",
      demoUrl: "#",
      repoUrl: "#",
      image: "",
      accent: ACCENTS[0],
    },
    {
      id: "p2",
      title: "PixelPaws",
      description:
        "A pet-adoption mobile app that matches shelters with families. Offline-first, with push notifications.",
      tags: ["React Native", "Firebase"],
      category: "Mobile",
      demoUrl: "#",
      repoUrl: "#",
      image: "",
      accent: ACCENTS[4],
    },
    {
      id: "p3",
      title: "DevSync",
      description:
        "A collaborative code editor with live cursors, syntax-aware presence, and conflict-free editing.",
      tags: ["Next.js", "WebSocket", "Redis"],
      category: "Web App",
      demoUrl: "#",
      repoUrl: "#",
      image: "",
      accent: ACCENTS[1],
    },
    {
      id: "p4",
      title: "Lumen API",
      description:
        "A batteries-included REST toolkit: auth, rate-limiting, and auto-generated docs out of the box.",
      tags: ["Node.js", "Express", "PostgreSQL"],
      category: "Backend",
      demoUrl: "#",
      repoUrl: "#",
      image: "",
      accent: ACCENTS[5],
    },
    {
      id: "p5",
      title: "Synthwave Player",
      description:
        "A music visualizer that reacts to audio frequencies in 3D — built for headphones and late nights.",
      tags: ["Three.js", "Web Audio"],
      category: "Creative",
      demoUrl: "#",
      repoUrl: "#",
      image: "",
      accent: ACCENTS[2],
    },
  ],
};

/* ============================================================
   Supabase data helpers
   ============================================================ */
async function loadContent() {
  try {
    const { data, error } = await supabase
      .from("portfolio_content")
      .select("data")
      .single();
    if (error) { console.warn("loadContent:", error.message); return null; }
    return data?.data || null;
  } catch (e) {
    console.warn("loadContent exception:", e);
    return null;
  }
}

async function persistContent(contentData) {
  try {
    // get the row id first
    const { data: row } = await supabase
      .from("portfolio_content")
      .select("id")
      .single();
    if (!row) return false;
    const { error } = await supabase
      .from("portfolio_content")
      .update({ data: contentData, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) { console.warn("persistContent:", error.message); return false; }
    return true;
  } catch (e) {
    console.warn("persistContent exception:", e);
    return false;
  }
}

// Upload image blob to Supabase Storage, return public URL
async function uploadImage(dataUrl, path) {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ext = blob.type === "image/png" ? "png" : "jpg";
    const filePath = `${path}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, blob, { upsert: true, contentType: blob.type });
    if (error) { console.warn("uploadImage:", error.message); return dataUrl; }
    const { data: pub } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    return pub.publicUrl;
  } catch (e) {
    console.warn("uploadImage exception:", e);
    return dataUrl;
  }
}

// Delete old image from storage by URL
async function deleteImage(url) {
  if (!url || !url.includes(STORAGE_BUCKET)) return;
  try {
    const path = url.split(`${STORAGE_BUCKET}/`)[1];
    if (path) await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  } catch (e) { /* ignore */ }
}

// Get current Supabase session
async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/* ============================================================
   Resize + compress an uploaded image into a small data URL
   so it stays well under the storage size limit
   ============================================================ */
function fileToDataURL(file, maxDim = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Could not read that image."));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

/* ============================================================
   Tech-stack brand icons (via simpleicons CDN, with fallback)
   ============================================================ */
const ICON_SLUGS = {
  "react": "react", "reactjs": "react", "react native": "react",
  "typescript": "typescript", "ts": "typescript",
  "javascript": "javascript", "js": "javascript",
  "next.js": "nextdotjs", "nextjs": "nextdotjs", "next": "nextdotjs",
  "node.js": "nodedotjs", "nodejs": "nodedotjs", "node": "nodedotjs",
  "tailwind": "tailwindcss", "tailwindcss": "tailwindcss", "tailwind css": "tailwindcss",
  "graphql": "graphql",
  "postgresql": "postgresql", "postgres": "postgresql",
  "three.js": "threedotjs", "threejs": "threedotjs", "three": "threedotjs",
  "python": "python", "docker": "docker", "figma": "figma",
  "aws": "amazonwebservices", "amazon web services": "amazonwebservices",
  "redis": "redis", "framer motion": "framer", "framer": "framer",
  "vue": "vuedotjs", "vue.js": "vuedotjs", "svelte": "svelte", "angular": "angular",
  "express": "express", "mongodb": "mongodb", "mysql": "mysql",
  "firebase": "firebase", "supabase": "supabase",
  "git": "git", "github": "github", "gitlab": "gitlab",
  "html": "html5", "html5": "html5", "css": "css3", "css3": "css3", "sass": "sass",
  "rust": "rust", "go": "go", "golang": "go", "java": "openjdk",
  "c++": "cplusplus", "c#": "csharp", "php": "php", "ruby": "ruby",
  "laravel": "laravel", "django": "django", "flask": "flask",
  "kubernetes": "kubernetes", "k8s": "kubernetes",
  "vite": "vite", "webpack": "webpack", "jest": "jest", "vitest": "vitest",
  "prisma": "prisma", "websocket": "socketdotio", "socket.io": "socketdotio",
  "d3": "d3dotjs", "d3.js": "d3dotjs", "tensorflow": "tensorflow",
  "flutter": "flutter", "swift": "swift", "kotlin": "kotlin",
};

function iconSlug(name) {
  const key = String(name).trim().toLowerCase();
  if (key in ICON_SLUGS) return ICON_SLUGS[key];
  return key.replace(/[\s.]/g, "");
}

/* Auto-group skills into a scannable overview */
const TECH_CATEGORIES = [
  { name: "Frontend", color: "var(--gold)", keys: ["react","reactjs","react native","vue","vue.js","svelte","angular","next.js","nextjs","next","typescript","ts","javascript","js","tailwind","tailwindcss","tailwind css","html","html5","css","css3","sass","framer motion","framer","d3","d3.js","three.js","threejs","three","flutter","swift","kotlin"] },
  { name: "Backend", color: "var(--rust)", keys: ["node.js","nodejs","node","express","python","django","flask","php","laravel","ruby","go","golang","rust","java","c++","c#","graphql","postgresql","postgres","mongodb","mysql","redis","prisma","websocket","socket.io"] },
  { name: "Tools & DevOps", color: "#a8854f", keys: ["docker","kubernetes","k8s","aws","amazon web services","git","github","gitlab","figma","vite","webpack","jest","vitest","firebase","supabase","tensorflow"] },
];

function groupSkills(skills) {
  const used = new Set();
  const groups = [];
  const key = (s) => String(s).trim().toLowerCase();
  for (const cat of TECH_CATEGORIES) {
    const items = skills.filter((s) => !used.has(s) && cat.keys.includes(key(s)));
    items.forEach((s) => used.add(s));
    if (items.length) groups.push({ name: cat.name, color: cat.color, items });
  }
  const other = skills.filter((s) => !used.has(s));
  if (other.length) groups.push({ name: "Other", color: "#8a6f5a", items: other });
  return groups;
}

/* ── Framer Motion scroll-reveal wrapper ─────────────────── */
function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15.4l-1.6-4.6L6 9.2l4.4-1.6L12 3z"/>
      <circle cx="19" cy="18" r="1.2"/>
    </svg>
  );
}

function SkillIcon({ name, size = 24 }) {
  const slug = iconSlug(name);
  const [err, setErr] = useState(false);
  if (!slug || err) {
    return (
      <span className="pf-ico fallback" style={{ width: size, height: size }}>
        <Code2 size={Math.round(size * 0.58)} color="#fff" />
      </span>
    );
  }
  return (
    <span className="pf-ico" style={{ width: size, height: size }}>
      <img
        src={"https://cdn.simpleicons.org/" + slug}
        alt=""
        loading="lazy"
        onError={() => setErr(true)}
      />
    </span>
  );
}

/* ============================================================
   Styles
   ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,500;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=Mulish:wght@300;400;500;600;700;800&display=swap');

.pf-root *{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
.pf-root{
  --ink:#180e08;--ink2:#21140c;--surface:#291a10;--surface2:#33210f;
  --line:rgba(232,201,160,.14);--cream:#f1e7d8;--muted:#b3a08d;
  --gold:#d8a978;--gold2:#ecd2ab;--gold-deep:#b07d4f;--rust:#bc6038;
  font-family:'Mulish',system-ui,sans-serif;background:#180e08;color:var(--cream);
  min-height:100vh;position:relative;overflow-x:hidden;line-height:1.6;-webkit-font-smoothing:antialiased;
}
.pf-display{font-family:'Playfair Display',serif;font-weight:700;letter-spacing:.005em}
.pf-mono{font-family:'Mulish',sans-serif;letter-spacing:.05em}

.pf-bg{display:none}
.pf-glow{position:absolute;border-radius:50%;filter:blur(120px);opacity:.45;animation:drift 24s ease-in-out infinite}
.pf-glow.g1{width:42vw;height:42vw;right:-8vw;top:-10vw;background:radial-gradient(circle,#b5602e,transparent 70%)}
.pf-glow.g2{width:34vw;height:34vw;left:-8vw;bottom:4vh;background:radial-gradient(circle,#7a4a24,transparent 70%);animation-delay:-10s}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(3vw,4vh)}}

.pf-wrap{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:0 28px}

.pf-nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);background:#0d0805;border-bottom:1px solid var(--line)}
.pf-nav-in{max-width:1180px;margin:0 auto;padding:18px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.pf-logo{font-family:'Playfair Display',serif;font-weight:700;font-size:22px;display:flex;align-items:center;gap:10px;letter-spacing:.02em;color:var(--cream)}
.pf-logo .dot{width:10px;height:10px;border-radius:50%;background:var(--gold);box-shadow:0 0 12px var(--gold)}
.pf-navlinks{display:flex;gap:2px;align-items:center}
.pf-navlinks a{color:var(--muted);text-decoration:none;font-size:11px;letter-spacing:.18em;text-transform:uppercase;padding:8px 14px;transition:.2s}
.pf-navlinks a:hover{color:var(--gold)}
.pf-iconbtn{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:rgba(232,201,160,.05);color:var(--gold);cursor:pointer;transition:.2s;text-decoration:none}
.pf-iconbtn:hover{border-color:var(--gold);background:rgba(216,169,120,.12)}
@media(max-width:760px){.pf-navlinks a{display:none}}

.pf-hero{position:relative;padding:60px 0 0}
.pf-cursor-glow{position:absolute;width:440px;height:440px;border-radius:50%;left:50%;top:38%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(216,169,120,.12),transparent 65%);filter:blur(24px);pointer-events:none;z-index:0;transition:transform .12s ease-out}
.pf-hero-grid{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr) auto;gap:48px;align-items:center}
.pf-hero-left{padding-right:8px}
.pf-stat-ico{width:46px;height:46px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:var(--gold);margin-left:auto;margin-bottom:6px}
@media(max-width:980px){.pf-hero-grid{grid-template-columns:1fr;gap:34px}}
.pf-eyebrow{font-size:12px;letter-spacing:.34em;text-transform:uppercase;color:var(--gold);margin-bottom:22px;font-weight:600}
.pf-name{font-size:clamp(40px,6vw,70px);line-height:1.05;background:linear-gradient(160deg,#f6e8d2,#d8a978 72%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.pf-roles-sub{margin-top:16px;color:var(--gold);font-size:13px;letter-spacing:.2em;text-transform:uppercase}
.pf-tagline{margin-top:22px;color:var(--muted);font-size:clamp(15px,1.6vw,17px);max-width:430px;line-height:1.75}
.pf-cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:34px}
.pf-btn{font-family:'Mulish';font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:15px 28px;border-radius:2px;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:10px;text-decoration:none;transition:.25s}
.pf-btn.primary{background:linear-gradient(135deg,var(--gold2),var(--gold));color:#1c1006}
.pf-btn.primary:hover{filter:brightness(1.06);transform:translateY(-2px)}
.pf-btn.ghost{background:transparent;border:1px solid var(--gold);color:var(--gold)}
.pf-btn.ghost:hover{background:rgba(216,169,120,.12)}

.pf-portrait{position:relative;border-radius:8px;overflow:hidden;aspect-ratio:3/4.2;border:1px solid var(--line);box-shadow:0 30px 60px rgba(0,0,0,.55)}
.pf-portrait img{width:100%;height:100%;object-fit:cover;object-position:center 18%;filter:saturate(.78) contrast(1.05) sepia(.32) hue-rotate(-12deg) brightness(.92)}
.pf-portrait::before{content:'';position:absolute;inset:0;background:linear-gradient(150deg,rgba(160,82,32,.32),rgba(24,14,8,.55));mix-blend-mode:multiply;z-index:1;pointer-events:none}
.pf-portrait::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(24,14,8,.8));pointer-events:none;z-index:2}
.pf-portrait.empty{display:grid;place-items:center;background:linear-gradient(160deg,var(--surface),var(--ink2))}
.pf-portrait.empty span{font-family:'Playfair Display',serif;font-size:84px;color:var(--gold)}
@media(max-width:980px){.pf-portrait{max-width:340px;margin:0 auto;width:100%}}

.pf-hero-stats{display:flex;flex-direction:column;gap:30px;text-align:right;align-self:center}
.pf-hero-stats b{font-family:'Playfair Display',serif;font-weight:600;font-size:clamp(34px,4vw,50px);color:var(--gold2);display:block;line-height:1}
.pf-hero-stats span{display:block;margin-top:7px;color:var(--muted);font-size:11px;letter-spacing:.16em;text-transform:uppercase}
@media(max-width:980px){.pf-hero-stats{flex-direction:row;justify-content:center;text-align:center;flex-wrap:wrap;gap:30px}}

.pf-hero-foot{position:relative;z-index:2;margin-top:40px;padding:24px 0;border-top:1px solid rgba(232,201,160,.2);display:flex;gap:44px;align-items:center;flex-wrap:wrap}
.pf-cinfo{display:flex;align-items:center;gap:14px}
.pf-cinfo .ic{width:48px;height:48px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:var(--gold);flex:none}
.pf-cinfo .lbl{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.pf-cinfo a,.pf-cinfo .val{display:block;color:var(--cream);font-size:14px;text-decoration:none;transition:.2s}
.pf-cinfo a:hover{color:var(--gold)}
.pf-social{display:flex;gap:12px;margin-left:auto}
@media(max-width:560px){.pf-social{margin-left:0}}

.pf-section{padding:88px 0;position:relative;z-index:2}
.pf-sec-dark{
  background:#29160d;
  margin-left:calc(-50vw + 50%);
  margin-right:calc(-50vw + 50%);
  width:100vw;
  padding-left:max(28px,calc((100vw - 1180px)/2 + 28px));
  padding-right:max(28px,calc((100vw - 1180px)/2 + 28px));
}
.pf-sec-light{
  background:#1c0e07;
  margin-left:calc(-50vw + 50%);
  margin-right:calc(-50vw + 50%);
  width:100vw;
  padding-left:max(28px,calc((100vw - 1180px)/2 + 28px));
  padding-right:max(28px,calc((100vw - 1180px)/2 + 28px));
}
.pf-kicker{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);font-weight:600}
.pf-h2{font-size:clamp(30px,4.4vw,46px);margin-top:16px;line-height:1.14;color:var(--cream)}
.pf-h2 em{font-style:italic;color:var(--gold)}
.pf-lead{color:var(--muted);max-width:560px;margin-top:16px;font-size:16px;line-height:1.8}

.pf-hero-full{
  background-size:cover;background-position:center top;background-repeat:no-repeat;
  min-height:600px;display:flex;flex-direction:column;justify-content:flex-end;
  padding-bottom:0;position:relative;overflow:hidden;
  width:100%;margin-left:0;margin-right:0;
}
.pf-hero-full .pf-wrap{
  max-width:none;padding:0 28px;
}
.pf-hero-overlay{
  position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(180deg,rgba(24,14,8,.18) 0%,rgba(24,14,8,.55) 70%,rgba(24,14,8,.92) 100%);
}
.pf-about-sec{
  background:#29160d;
  padding-top:0;padding-bottom:0;
  margin-left:calc(-50vw + 50%);margin-right:calc(-50vw + 50%);
  width:100vw;position:relative;
}
.pf-about-sec .pf-reveal{padding:60px max(28px,calc((100vw - 1180px)/2 + 28px)) 0;}
.pf-about-sec .pf-about-grid{
  display:grid;grid-template-columns:.45fr .55fr;gap:0;align-items:stretch;
  padding:30px max(28px,calc((100vw - 1180px)/2 + 28px)) 70px;
}
/* pf-about-grid defined in pf-about-sec block */
@media(max-width:860px){.pf-about-sec .pf-about-grid{grid-template-columns:1fr;gap:0;padding-left:20px;padding-right:20px;} .pf-about-text{padding-left:0;padding-top:32px;}}
.pf-about-img{position:relative;overflow:hidden;min-height:420px;border:none;border-radius:0;}
.pf-about-img img{width:100%;height:100%;object-fit:cover;object-position:center 18%;filter:saturate(.78) contrast(1.05) sepia(.32) hue-rotate(-12deg) brightness(.9)}
.pf-about-img::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 55%,rgba(30,17,8,.9)),linear-gradient(150deg,rgba(160,82,32,.22),rgba(24,14,8,.4));mix-blend-mode:multiply}
.pf-about-empty{position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(160deg,var(--surface),var(--ink2));} .pf-about-img{position:relative;}
.pf-about-empty span{font-size:72px;color:var(--gold)}
.pf-about-text{align-self:center;padding-left:52px;}
.pf-about-lead{font-family:'Lora',serif;font-size:clamp(20px,2.5vw,26px);line-height:1.45;color:var(--cream)}
.pf-about-body{margin-top:22px;color:var(--muted);font-size:14.5px;line-height:1.8;max-width:520px}
.pf-about-divider{height:1px;background:var(--line);margin:30px 0 22px;max-width:560px}
.pf-highlights{list-style:none;display:flex;flex-direction:column;gap:12px;max-width:580px}
.pf-highlights li{display:flex;gap:14px;align-items:flex-start;color:var(--muted);font-size:13.5px;line-height:1.6}
.pf-highlights .dot{width:24px;height:24px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:var(--gold);flex:none;margin-top:1px}
.pf-about-meta{margin-top:24px;color:var(--gold);font-size:12px;letter-spacing:.2em;text-transform:uppercase}


.pf-techcats{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-top:30px}
.pf-techcard{border:1px solid var(--line);border-radius:8px;padding:24px;background:rgba(255,247,236,.025)}
.pf-techcard h3{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:10px;margin-bottom:18px}
.pf-techcard h3 .tdot{width:8px;height:8px;border-radius:50%;flex:none;box-shadow:0 0 10px currentColor}
.pf-techcard h3 em{font-style:normal;margin-left:auto;opacity:.55}
.pf-techgrid{display:flex;flex-wrap:wrap;gap:10px}
.pf-techitem{display:inline-flex;align-items:center;gap:10px;padding:9px 14px 9px 9px;border:1px solid var(--line);border-radius:6px;background:rgba(255,247,236,.03);font-size:13px;transition:.18s;cursor:default;color:var(--cream)}
.pf-techitem:hover{transform:translateY(-3px);border-color:var(--gold);box-shadow:0 8px 22px rgba(0,0,0,.4)}
.pf-ico{border-radius:5px;background:#f3ead9;display:grid;place-items:center;flex:none;padding:3px;overflow:hidden}
.pf-ico img{width:100%;height:100%;object-fit:contain;display:block}
.pf-ico.fallback{background:linear-gradient(135deg,var(--gold),var(--rust));padding:0}

.pf-filters{display:flex;gap:10px;flex-wrap:wrap;margin-top:30px}
.pf-filter{font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:9px 18px;border-radius:2px;cursor:pointer;border:1px solid var(--line);background:transparent;color:var(--muted);transition:.2s}
.pf-filter:hover{color:var(--gold);border-color:var(--gold)}
.pf-filter.on{color:#1c1006;background:var(--gold);border-color:var(--gold);font-weight:700}

.pf-projects{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:34px}
@media(max-width:880px){.pf-projects{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.pf-projects{grid-template-columns:1fr}}
.pf-card{border-radius:8px;overflow:hidden;border:1px solid var(--line);background:var(--surface);cursor:pointer;transition:transform .15s ease,box-shadow .25s,border-color .25s;transform-style:preserve-3d;will-change:transform}
.pf-card:hover{box-shadow:0 26px 60px rgba(0,0,0,.55);border-color:var(--gold)}
.pf-cover{height:150px;display:grid;place-items:center;position:relative;overflow:hidden}
.pf-cover img{width:100%;height:100%;object-fit:cover}
.pf-cover .initial{font-family:'Playfair Display',serif;font-weight:700;font-size:48px;color:rgba(255,243,228,.92)}
.pf-cover .cat{position:absolute;top:12px;left:12px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;padding:5px 10px;border-radius:2px;background:rgba(24,14,8,.55);backdrop-filter:blur(4px);color:var(--gold2)}
.pf-cbody{padding:22px}
.pf-cbody h3{font-family:'Playfair Display',serif;font-weight:600;font-size:21px;display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--cream)}
.pf-cbody p{color:var(--muted);font-size:14px;margin-top:10px;line-height:1.65;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pf-tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.pf-tag{font-size:11px;padding:5px 9px 5px 5px;border-radius:4px;background:rgba(255,247,236,.05);color:var(--muted);display:inline-flex;align-items:center;gap:6px}

.pf-timeline{margin-top:38px;position:relative;padding-left:32px}
.pf-timeline::before{content:'';position:absolute;left:6px;top:8px;bottom:8px;width:1px;background:linear-gradient(var(--gold),var(--rust),transparent)}
.pf-exp{position:relative;padding-bottom:34px}
.pf-exp:last-child{padding-bottom:0}
.pf-exp::before{content:'';position:absolute;left:-32px;top:4px;width:13px;height:13px;border-radius:50%;background:var(--ink);border:2px solid var(--gold);box-shadow:0 0 12px rgba(216,169,120,.6)}
.pf-exp h4{font-family:'Playfair Display',serif;font-weight:600;font-size:20px;color:var(--cream)}
.pf-exp .co{color:var(--gold);font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin-top:5px}
.pf-exp .per{color:var(--muted);font-size:12px;letter-spacing:.06em;margin-top:5px}
.pf-exp p{color:var(--muted);margin-top:10px;font-size:14.5px;max-width:640px;line-height:1.75}

.pf-contact{
  text-align:center;
  border:1px solid rgba(216,169,120,.18);
  border-radius:16px;
  padding:clamp(48px,7vw,88px) clamp(28px,6vw,80px);
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(188,96,56,.22), transparent 65%),
    radial-gradient(ellipse 60% 40% at 80% 110%, rgba(176,125,79,.12), transparent 60%),
    rgba(255,255,255,.022);
  position:relative;overflow:hidden;
}
.pf-contact::before{
  content:'';position:absolute;inset:-1px;border-radius:17px;
  background:linear-gradient(135deg,rgba(216,169,120,.25),transparent 40%,transparent 60%,rgba(216,169,120,.1));
  pointer-events:none;z-index:0;
}
.pf-contact > *{position:relative;z-index:1;}

/* deco top line */
.pf-contact-deco{display:flex;align-items:center;gap:16px;justify-content:center;}
.pf-contact-deco span{flex:1;max-width:80px;height:1px;background:linear-gradient(90deg,transparent,rgba(216,169,120,.4));}
.pf-contact-deco span:last-child{background:linear-gradient(270deg,transparent,rgba(216,169,120,.4));}
.pf-contact-star{color:var(--gold);font-size:18px;line-height:1;}

.pf-contact-title{font-size:clamp(28px,5vw,54px)!important;margin-top:16px!important;line-height:1.1!important;}
.pf-contact-lead{margin:18px auto 0!important;max-width:480px;text-align:center;}

/* Email CTA */
.pf-contact-email{
  display:inline-flex;align-items:center;gap:14px;
  margin-top:36px;padding:18px 36px;border-radius:4px;
  background:linear-gradient(135deg,var(--gold2),var(--gold));
  color:#1c1006;font-family:'Mulish';font-weight:800;
  font-size:14px;letter-spacing:.1em;text-transform:uppercase;
  text-decoration:none;position:relative;overflow:hidden;
  animation:btnBounce 2.2s ease-in-out infinite;
  box-shadow:0 8px 28px rgba(216,169,120,.28);
}
@keyframes btnBounce{
  0%,100%{transform:translateY(0);box-shadow:0 8px 28px rgba(216,169,120,.28);}
  50%{transform:translateY(-7px);box-shadow:0 18px 40px rgba(216,169,120,.42);}
}
.pf-contact-email::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 50%);
  pointer-events:none;
}
.pf-contact-email:hover{animation-play-state:paused;filter:brightness(1.08);}
.pf-contact-arrow{margin-left:2px;}

/* Divider */
.pf-contact-divider{
  display:flex;align-items:center;gap:16px;
  margin:32px auto 0;max-width:320px;
}
.pf-contact-divider span{flex:1;height:1px;background:var(--line);}
.pf-contact-divider small{color:var(--muted);font-size:11px;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;}

/* Social buttons */
.pf-contact-social{display:flex;gap:14px;justify-content:center;margin-top:20px;flex-wrap:wrap;}
.pf-contact-soc-btn{
  display:inline-flex;align-items:center;gap:10px;
  padding:12px 24px;border-radius:4px;
  border:1px solid rgba(216,169,120,.25);
  background:rgba(216,169,120,.06);
  color:var(--cream);text-decoration:none;
  font-family:'Mulish';font-weight:600;font-size:13px;
  letter-spacing:.06em;transition:.2s;
}
.pf-contact-soc-btn:hover{
  border-color:var(--gold);background:rgba(216,169,120,.14);
  transform:translateY(-2px);color:var(--gold);
}
.pf-footer{
  text-align:center;padding:44px 0;color:var(--muted);font-size:11px;
  letter-spacing:.14em;text-transform:uppercase;border-top:1px solid var(--line);
  position:relative;z-index:2;background:#29160d;
  margin-left:calc(-50vw + 50%);margin-right:calc(-50vw + 50%);width:100vw;
}

.pf-reveal{opacity:0;transform:translateY(26px);transition:opacity .7s,transform .7s}
.pf-reveal.pf-in{opacity:1;transform:none}

.pf-overlay{position:fixed;inset:0;z-index:100;background:rgba(12,7,4,.78);backdrop-filter:blur(8px);display:grid;place-items:center;padding:20px;animation:fade .25s}
@keyframes fade{from{opacity:0}to{opacity:1}}
.pf-modal{width:100%;max-width:560px;max-height:88vh;overflow:auto;background:var(--ink2);border:1px solid var(--line);border-radius:12px;padding:28px;animation:pop .3s}
.pf-modal.wide{max-width:720px}
@keyframes pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
.pf-modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.pf-modal-head h3{font-family:'Playfair Display',serif;font-weight:700;font-size:24px;color:var(--cream)}

.pf-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:22px;border-bottom:1px solid var(--line);padding-bottom:14px}
.pf-tab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:8px 14px;border-radius:3px;cursor:pointer;border:1px solid transparent;background:transparent;color:var(--muted);display:inline-flex;align-items:center;gap:7px}
.pf-tab:hover{color:var(--gold)}
.pf-tab.on{color:#1c1006;background:var(--gold);font-weight:700}

.pf-field{margin-bottom:16px}
.pf-field label{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:8px}
.pf-input,.pf-textarea{width:100%;background:rgba(255,247,236,.04);border:1px solid var(--line);border-radius:5px;padding:12px 14px;color:var(--cream);font-family:'Mulish';font-size:15px;transition:.2s}
.pf-input:focus,.pf-textarea:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(216,169,120,.18)}
.pf-textarea{resize:vertical;min-height:84px;line-height:1.6}
.pf-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:520px){.pf-row{grid-template-columns:1fr}}
.pf-swatches{display:flex;gap:10px;flex-wrap:wrap}
.pf-swatch{width:38px;height:38px;border-radius:6px;cursor:pointer;border:2px solid transparent;transition:.15s}
.pf-swatch.on{border-color:var(--gold2);transform:scale(1.1)}

.pf-sub{border:1px solid var(--line);border-radius:8px;padding:18px;margin-bottom:20px;background:rgba(255,247,236,.02)}
.pf-sub h4{font-family:'Playfair Display',serif;font-size:16px;margin-bottom:14px;color:var(--cream)}

.pf-adminitem{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--line);border-radius:8px;margin-bottom:10px;background:rgba(255,247,236,.03)}
.pf-adminitem .sw{width:36px;height:36px;border-radius:6px;flex:none;display:grid;place-items:center;color:#fff}
.pf-adminitem .meta{flex:1;min-width:0}
.pf-adminitem .meta b{font-family:'Playfair Display',serif;font-size:15px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--cream)}
.pf-adminitem .meta span{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.pf-mini{width:34px;height:34px;border-radius:6px;border:1px solid var(--line);background:rgba(255,247,236,.04);color:var(--muted);cursor:pointer;display:grid;place-items:center;transition:.2s;flex:none}
.pf-mini:hover{color:var(--gold)}
.pf-mini.del:hover{color:var(--rust);border-color:var(--rust)}

.pf-savebar{position:sticky;bottom:0;background:var(--ink2);padding:16px 0 4px;margin-top:20px;border-top:1px solid var(--line);display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.pf-saved{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--gold)}
.pf-hint{font-size:12px;color:var(--muted);margin-top:10px;line-height:1.5}
.pf-imgprev{display:flex;gap:12px;align-items:center;margin-bottom:10px}
.pf-imgprev img{width:104px;height:66px;object-fit:cover;border-radius:6px;border:1px solid var(--line)}

.pf-skilledit{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.pf-chip{font-size:13px;padding:8px 12px 8px 8px;border-radius:6px;border:1px solid var(--line);background:rgba(255,247,236,.04);display:inline-flex;align-items:center;gap:9px;white-space:nowrap;color:var(--cream)}
.pf-skilledit .rm{cursor:pointer;display:grid;place-items:center;color:var(--muted);transition:.15s}
.pf-skilledit .rm:hover{color:var(--rust)}

.pf-detail-cover{height:170px;border-radius:8px;margin-bottom:20px;display:grid;place-items:center;overflow:hidden}
.pf-detail-cover img{width:100%;height:100%;object-fit:cover}

@media(prefers-reduced-motion:reduce){
  .pf-glow,.pf-card{animation:none!important}
  .pf-reveal{opacity:1!important;transform:none!important}
  .pf-card{transition:none}
}
`;

/* ============================================================
   Main component
   ============================================================ */
export default function Portfolio() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [filter, setFilter] = useState("All");
  const [detail, setDetail] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const glowRef = useRef(null);
  const heroRef = useRef(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    loadContent().then((saved) => {
      if (alive && saved) setContent((prev) => ({ ...prev, ...saved }));
      if (alive) setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const { profile, contact, skills, experience, projects, highlights = [] } = content;

  const onHeroMove = useCallback((e) => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;
    const r = hero.getBoundingClientRect();
    glow.style.transform = `translate(${e.clientX - r.left - 190}px,${
      e.clientY - r.top - 190
    }px)`;
  }, []);

  // scroll reveal handled by FadeUp / framer-motion

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const visible =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);
  const uniqueTech = new Set(projects.flatMap((p) => p.tags)).size;
  const roles = profile.roles.filter(Boolean);

  const tilt = (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${
      -y * 8
    }deg) translateY(-6px)`;
  };
  const untilt = (e) => {
    e.currentTarget.style.transform = "";
  };
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  async function saveAll(next) {
    setContent(next);
    // Images that are still base64 dataURLs get uploaded to Storage
    let updated = { ...next };
    const upload = async (val, path) => {
      if (val && val.startsWith("data:")) return await uploadImage(val, path);
      return val;
    };
    updated.profile = {
      ...updated.profile,
      avatar: await upload(updated.profile.avatar, "hero"),
      avatarAbout: await upload(updated.profile.avatarAbout, "about"),
    };
    updated.projects = await Promise.all(
      (updated.projects || []).map(async (p) => ({
        ...p,
        image: await upload(p.image, `project-${p.id}`),
      }))
    );
    setContent(updated);
    await persistContent(updated);
  }

  if (loading) return (
    <div className="pf-root" style={{ display:"grid", placeItems:"center", minHeight:"100vh" }}>
      <style>{CSS}</style>
      <div style={{ textAlign:"center", color:"var(--gold)", fontFamily:"'Playfair Display',serif", fontSize:22 }}>
        <div style={{ fontSize:32, marginBottom:16 }}>✦</div>
        Loading…
      </div>
    </div>
  );

  return (
    <div className="pf-root">
      <style>{CSS}</style>

      <div className="pf-bg" aria-hidden>
        <div className="pf-glow g1" />
        <div className="pf-glow g2" />
      </div>

      <nav className="pf-nav">
        <div className="pf-nav-in">
          <div className="pf-logo">
            <span className="dot" />
            {(profile.name || "Your").split(" ")[0]}
            <span style={{ color: "var(--gold)" }}>.dev</span>
          </div>
          <div className="pf-navlinks">
            <a href="#work" onClick={scrollTo("work")}>Work</a>
            <a href="#experience" onClick={scrollTo("experience")}>Experience</a>
            <a href="#contact" onClick={scrollTo("contact")}>Contact</a>
            <button className="pf-iconbtn" title="Admin" onClick={() => setAdminOpen(true)}>
              <Lock size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO — full width outside pf-wrap */}
      <header className="pf-hero pf-hero-full" ref={heroRef} onMouseMove={onHeroMove}
        style={profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : {}}>
        {profile.avatar && <div className="pf-hero-overlay" />}
        <div className="pf-cursor-glow" ref={glowRef} aria-hidden />
        <div className="pf-wrap" style={{ position: "relative", zIndex: 2, width: "100%" }}>
          <div className="pf-hero-grid">
            <div className="pf-hero-left">
              <div className="pf-eyebrow">| {profile.name} |</div>
              <h1 className="pf-name pf-display">{profile.headline || (roles[0] || "Developer")}</h1>
              <p className="pf-tagline">{profile.tagline}</p>
              <div className="pf-cta">
                <a className="pf-btn primary" href="#work" onClick={scrollTo("work")}>
                  <ArrowUpRight size={15} /> Project Gallery
                </a>
                <a className="pf-btn ghost" href="#contact" onClick={scrollTo("contact")}>
                  Contact Me
                </a>
              </div>
            </div>
            <div />
            <div className="pf-hero-stats">
              <div className="pf-stat-ico"><Code2 size={20} /></div>
              <div><b>{profile.years}</b><span>years of work</span></div>
              <div><b>{profile.nominations || projects.length}</b><span>{profile.nominations ? "recognitions" : "projects"}</span></div>
            </div>
          </div>
          <div className="pf-hero-foot">
            <div className="pf-cinfo">
              <span className="ic"><Mail size={18} /></span>
              <div>
                <div className="lbl">Contact Information</div>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            </div>
            <div className="pf-cinfo">
              <span className="ic"><MapPin size={18} /></span>
              <div>
                <div className="lbl">Based In</div>
                <span className="val">{profile.location}</span>
              </div>
            </div>
            <div className="pf-social">
              {contact.github && (
                <a className="pf-iconbtn" href={contact.github} title="GitHub" target="_blank" rel="noreferrer"><Github size={18} /></a>
              )}
              {contact.linkedin && (
                <a className="pf-iconbtn" href={contact.linkedin} title="LinkedIn" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="pf-wrap">
        {/* ABOUT */}
        <section className="pf-section pf-about-sec" id="about">
          <FadeUp>
            <div className="pf-eyebrow">| About Me |</div>
          </FadeUp>
          <FadeUp delay={0.1} className="pf-about-grid">
            <div className="pf-about-img">
              {(profile.avatarAbout || profile.avatar) ? (
                <img src={profile.avatarAbout || profile.avatar} alt={profile.name} />
              ) : (
                <div className="pf-about-empty"><span>{(profile.name || "A").charAt(0)}</span></div>
              )}
            </div>
            <div className="pf-about-text">
              <p className="pf-about-lead">{profile.about}</p>
              {profile.aboutMore && (
                <p className="pf-about-body">{profile.aboutMore}</p>
              )}
              {highlights.length > 0 && (
                <>
                  <div className="pf-about-divider" />
                  <ul className="pf-highlights">
                    {highlights.map((h, i) => (
                      <li key={h.id || i}>
                        <span className="dot"><Sparkle /></span>
                        <span>{h.text}{i < highlights.length - 1 ? ";" : "."}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </FadeUp>
        </section>

        {/* TECH STACK */}
        <section className="pf-section pf-sec-light" id="tech">
          <FadeUp>
            <div className="pf-kicker">Tech stack</div>
            <h2 className="pf-h2 pf-display">Tools of the <em>trade</em>.</h2>
          </FadeUp>
          <FadeUp delay={0.1} className="pf-techcats">
            {groupSkills(skills).map((g) => (
              <div className="pf-techcard" key={g.name}>
                <h3>
                  <span className="tdot" style={{ background: g.color, color: g.color }} />
                  {g.name} <em>{g.items.length}</em>
                </h3>
                <div className="pf-techgrid">
                  {g.items.map((s) => (
                    <span className="pf-techitem" key={s}>
                      <SkillIcon name={s} size={26} /> {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section className="pf-section pf-sec-dark" id="experience">
            <FadeUp>
              <div className="pf-kicker">Career</div>
              <h2 className="pf-h2 pf-display">Where I've <em>worked</em>.</h2>
            </FadeUp>
            <FadeUp delay={0.1} className="pf-timeline">
              {experience.map((x) => (
                <div className="pf-exp" key={x.id}>
                  <h4 className="pf-display">{x.role}</h4>
                  <div className="co">{x.company}</div>
                  <div className="per">{x.period}</div>
                  {x.description && <p>{x.description}</p>}
                </div>
              ))}
            </FadeUp>
          </section>
        )}

        {/* WORK */}
        <section className="pf-section pf-sec-light" id="work">
          <FadeUp>
            <div className="pf-kicker">Selected work</div>
            <h2 className="pf-h2 pf-display">Things I've <em>built</em>.</h2>
          </FadeUp>
          <FadeUp delay={0.08} className="pf-filters">
            {categories.map((c) => (
              <button key={c} className={"pf-filter" + (filter === c ? " on" : "")} onClick={() => setFilter(c)}>
                {c}
              </button>
            ))}
          </FadeUp>
          <div className="pf-projects">
            {visible.map((p, i) => (
              <motion.article
                key={p.id}
                className="pf-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: [0.22,1,0.36,1], delay: i * 0.08 }}
                onMouseMove={tilt} onMouseLeave={untilt} onClick={() => setDetail(p)}>
                <div className="pf-cover" style={{ background: `linear-gradient(135deg, ${p.accent[0]}, ${p.accent[1]})` }}>
                  {p.image ? <img src={p.image} alt={p.title} /> : <span className="initial">{p.title.charAt(0)}</span>}
                  <span className="cat pf-mono">{p.category}</span>
                </div>
                <div className="pf-cbody">
                  <h3 className="pf-display">
                    {p.title}
                    <ArrowUpRight size={18} style={{ color: p.accent[1], flex: "none" }} />
                  </h3>
                  <p>{p.description}</p>
                  <div className="pf-tags">
                    {p.tags.map((t) => <span className="pf-tag" key={t}><SkillIcon name={t} size={16} /> {t}</span>)}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          {visible.length === 0 && <p className="pf-lead">No projects in this category yet.</p>}
        </section>

        {/* CONTACT */}
        <section className="pf-section pf-sec-dark" id="contact">
          <FadeUp><div className="pf-contact">
            {/* Decorative top line */}
            <div className="pf-contact-deco" aria-hidden>
              <span /><span className="pf-contact-star">✦</span><span />
            </div>

            <div className="pf-kicker" style={{ marginTop: 32 }}>Get in touch</div>
            <h2 className="pf-h2 pf-display pf-contact-title">
              Let's build something <em>memorable</em>.
            </h2>
            <p className="pf-lead pf-contact-lead">
              Got a project, a role, or just want to chat? My inbox is always open.
            </p>

            {/* Email button — full width pill */}
            <a className="pf-contact-email" href={`mailto:${contact.email}`}>
              <Mail size={18} />
              <span>{contact.email}</span>
              <ArrowUpRight size={16} className="pf-contact-arrow" />
            </a>

            {/* Divider */}
            <div className="pf-contact-divider">
              <span />
              <small>or find me on</small>
              <span />
            </div>

            {/* Social row */}
            <div className="pf-contact-social">
              {contact.github && (
                <a className="pf-contact-soc-btn" href={contact.github} target="_blank" rel="noreferrer">
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
              )}
              {contact.linkedin && (
                <a className="pf-contact-soc-btn" href={contact.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div></FadeUp>
        </section>
      </div>

      <footer className="pf-footer">
        <div className="pf-wrap">built with React + ☕ — © {new Date().getFullYear()} {profile.name}</div>
      </footer>

      {/* PROJECT DETAIL */}
      {detail && (
        <div className="pf-overlay" onClick={() => setDetail(null)}>
          <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pf-modal-head">
              <h3 className="pf-display">{detail.title}</h3>
              <button className="pf-iconbtn" onClick={() => setDetail(null)}><X size={18} /></button>
            </div>
            <div className="pf-detail-cover" style={{ background: `linear-gradient(135deg, ${detail.accent[0]}, ${detail.accent[1]})` }}>
              {detail.image ? <img src={detail.image} alt={detail.title} /> : <span className="initial pf-display" style={{ fontSize: 60, color: "rgba(255,255,255,.9)" }}>{detail.title.charAt(0)}</span>}
            </div>
            <span className="pf-tag pf-mono">{detail.category}</span>
            <p style={{ color: "var(--muted)", marginTop: 14, lineHeight: 1.6 }}>{detail.description}</p>
            <div className="pf-tags" style={{ marginTop: 16 }}>
              {detail.tags.map((t) => <span className="pf-tag" key={t}><SkillIcon name={t} size={18} /> {t}</span>)}
            </div>
            <div className="pf-cta" style={{ justifyContent: "flex-start", marginTop: 24 }}>
              {detail.demoUrl && detail.demoUrl !== "#" && (
                <a className="pf-btn primary" href={detail.demoUrl} target="_blank" rel="noreferrer">Live demo <ExternalLink size={16} /></a>
              )}
              {detail.repoUrl && detail.repoUrl !== "#" && (
                <a className="pf-btn ghost" href={detail.repoUrl} target="_blank" rel="noreferrer"><Github size={16} /> Code</a>
              )}
            </div>
          </div>
        </div>
      )}

      {adminOpen && (
        <AdminPanel content={content} onClose={() => setAdminOpen(false)} onSave={saveAll} />
      )}
    </div>
  );
}


/* ============================================================
   Image Cropper Modal — drag to reposition, slider to zoom
   props:
     src        : raw dataURL / object URL of the picked file
     aspectRatio: width/height of the display slot (e.g. 16/9 or 3/4)
     previewLabel: text shown above the live preview frame
     onConfirm  : (croppedDataURL) => void
     onCancel   : () => void
   ============================================================ */
function ImageCropperModal({ src, aspectRatio = 16 / 9, previewLabel = "Preview", onConfirm, onCancel }) {
  const PREVIEW_W = 460;
  const PREVIEW_H = Math.round(PREVIEW_W / aspectRatio);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imgNat, setImgNat] = useState({ w: 1, h: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const scaleRef = useRef(scale);
  const imgNatRef = useRef(imgNat);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { imgNatRef.current = imgNat; }, [imgNat]);

  // Clamp so image always fully covers the preview
  const clamp = useCallback((ox, oy, sc) => {
    const nat = imgNatRef.current;
    const iw = nat.w * sc;
    const ih = nat.h * sc;
    return {
      x: Math.min(0, Math.max(PREVIEW_W - iw, ox)),
      y: Math.min(0, Math.max(PREVIEW_H - ih, oy)),
    };
  }, [PREVIEW_W, PREVIEW_H]);

  // Auto-fit on image load
  const onImgLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.target;
    setImgNat({ w, h });
    imgNatRef.current = { w, h };
    const fit = Math.max(PREVIEW_W / w, PREVIEW_H / h);
    setScale(fit);
    scaleRef.current = fit;
    const cx = (PREVIEW_W - w * fit) / 2;
    const cy = (PREVIEW_H - h * fit) / 2;
    setOffset(clamp(cx, cy, fit));
  };

  // Global pointer events — works even when cursor leaves frame
  useEffect(() => {
    const move = (e) => {
      if (!dragging.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      lastPos.current = { x: clientX, y: clientY };
      setOffset((prev) => clamp(prev.x + dx, prev.y + dy, scaleRef.current));
    };
    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [clamp]);

  const onPointerDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    containerRef.current?.setPointerCapture?.(e.pointerId);
  };

  const handleScale = (v) => {
    const ns = parseFloat(v);
    setScale(ns);
    scaleRef.current = ns;
    setOffset((prev) => clamp(prev.x, prev.y, ns));
  };

  // Crop: draw the visible portion onto a canvas and export
  const handleConfirm = () => {
    const canvas = document.createElement("canvas");
    const OUTPUT = 1200;
    canvas.width = OUTPUT;
    canvas.height = Math.round(OUTPUT / aspectRatio);
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      // ratio between canvas output and preview display
      const ratio = OUTPUT / PREVIEW_W;
      ctx.drawImage(
        img,
        -offset.x / scale,            // src x
        -offset.y / scale,            // src y
        PREVIEW_W / scale,            // src w
        PREVIEW_H / scale,            // src h
        0, 0, canvas.width, canvas.height
      );
      onConfirm(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.src = src;
  };

  const minScale = Math.max(PREVIEW_W / imgNat.w, PREVIEW_H / imgNat.h);
  const maxScale = minScale * 4;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(8,4,2,.88)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "#1a0f08", border: "1px solid rgba(232,201,160,.15)",
        borderRadius: 14, padding: 28, width: "100%", maxWidth: 520,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#f1e7d8" }}>
              Adjust photo
            </div>
            <div style={{ fontSize: 12, color: "#b3a08d", marginTop: 4, letterSpacing: ".1em" }}>
              {previewLabel}
            </div>
          </div>
          <button onClick={onCancel} style={{
            width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(232,201,160,.18)",
            background: "transparent", color: "#b3a08d", cursor: "pointer",
            display: "grid", placeItems: "center",
          }}>✕</button>
        </div>

        {/* Preview frame */}
        <div style={{
          width: PREVIEW_W, maxWidth: "100%",
          height: PREVIEW_H,
          position: "relative", overflow: "hidden",
          borderRadius: 8, border: "2px solid rgba(216,169,120,.35)",
          cursor: isDragging ? "grabbing" : "grab", userSelect: "none",
          background: "#0d0805",
        }}
          ref={containerRef}
          onPointerDown={onPointerDown}
        >
          <img
            src={src}
            onLoad={onImgLoad}
            draggable={false}
            style={{
              position: "absolute",
              width: imgNat.w * scale,
              height: imgNat.h * scale,
              left: 0,
              top: 0,
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              pointerEvents: "none",
              objectFit: "unset",
              willChange: "transform",
              userSelect: "none",
            }}
          />
          {/* Cross-hair guide */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(rgba(216,169,120,.08) 1px,transparent 1px) center/33.33% 33.33%," +
                        "linear-gradient(90deg,rgba(216,169,120,.08) 1px,transparent 1px) center/33.33% 33.33%",
          }} />
          {/* Drag hint */}
          <div style={{
            position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
            background: "rgba(13,8,5,.7)", borderRadius: 20, padding: "4px 12px",
            fontSize: 11, color: "#d8a978", letterSpacing: ".08em", pointerEvents: "none",
          }}>
            ↔ ลากเพื่อปรับตำแหน่ง
          </div>
        </div>

        {/* Zoom slider */}
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12, color: "#b3a08d", whiteSpace: "nowrap" }}>ซูม</span>
          <input
            type="range"
            min={minScale}
            max={maxScale}
            step={(maxScale - minScale) / 200}
            value={scale}
            onChange={(e) => handleScale(e.target.value)}
            style={{ flex: 1, accentColor: "#d8a978", cursor: "pointer" }}
          />
          <span style={{ fontSize: 12, color: "#b3a08d", minWidth: 40 }}>
            {Math.round((scale / minScale - 1) * 100 + 100)}%
          </span>
        </div>
        <div style={{ fontSize: 11, color: "#8a6f5a", marginTop: 6, letterSpacing: ".06em" }}>
          ขนาดที่ export: {Math.round(1200)}×{Math.round(1200 / aspectRatio)}px
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1, fontFamily: "'Mulish'", fontWeight: 700, fontSize: 12,
              letterSpacing: ".1em", textTransform: "uppercase",
              padding: "14px 20px", borderRadius: 2, cursor: "pointer", border: "none",
              background: "linear-gradient(135deg,#ecd2ab,#d8a978)", color: "#1c1006",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            ✓ ใช้รูปนี้
          </button>
          <button
            onClick={onCancel}
            style={{
              fontFamily: "'Mulish'", fontWeight: 700, fontSize: 12,
              letterSpacing: ".1em", textTransform: "uppercase",
              padding: "14px 20px", borderRadius: 2, cursor: "pointer",
              background: "transparent", border: "1px solid #d8a978", color: "#d8a978",
            }}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Admin panel — passcode + full content management
   ============================================================ */
const TABS = ["Profile", "Contact", "Skills", "Highlights", "Experience", "Projects"];

function emptyProject() {
  return { id: "", title: "", description: "", tags: "", category: "Web App", demoUrl: "", repoUrl: "", image: "", accent: ACCENTS[0] };
}
function emptyExp() {
  return { id: "", role: "", company: "", period: "", description: "" };
}

function AdminPanel({ content, onClose, onSave }) {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("Profile");

  // Check existing session on mount
  useEffect(() => {
    getSession().then((s) => { if (s) setUnlocked(true); });
  }, []);
  const [draft, setDraft] = useState(content);
  const [savedFlash, setSavedFlash] = useState(false);

  // sub-form state
  const [skillInput, setSkillInput] = useState("");
  const [expForm, setExpForm] = useState(emptyExp());
  const [editingExp, setEditingExp] = useState(false);
  const [projForm, setProjForm] = useState(emptyProject());
  const [editingProj, setEditingProj] = useState(false);
  const [imgErr, setImgErr] = useState("");
  const fileRef = useRef(null);
  const [avatarErr, setAvatarErr] = useState("");
  const avatarRef = useRef(null);
  const aboutAvatarRef = useRef(null);
  // Cropper modal state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState("");
  const [cropperAspect, setCropperAspect] = useState(16/9);
  const [cropperLabel, setCropperLabel] = useState("");
  const [cropperTarget, setCropperTarget] = useState(""); // "hero"|"about"|"project"

  const setProfile = (k) => (e) =>
    setDraft((d) => ({ ...d, profile: { ...d.profile, [k]: e.target.value } }));
  const setContactF = (k) => (e) =>
    setDraft((d) => ({ ...d, contact: { ...d.contact, [k]: e.target.value } }));

  const commit = () => {
    onSave(draft);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  // skills
  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    setDraft((d) => ({ ...d, skills: [...d.skills, v] }));
    setSkillInput("");
  };
  const rmSkill = (i) =>
    setDraft((d) => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }));

  // experience
  const submitExp = () => {
    if (!expForm.role.trim()) return;
    const rec = { ...expForm, id: expForm.id || "e" + Date.now() };
    setDraft((d) => ({
      ...d,
      experience: editingExp
        ? d.experience.map((x) => (x.id === rec.id ? rec : x))
        : [...d.experience, rec],
    }));
    setExpForm(emptyExp());
    setEditingExp(false);
  };
  const editExp = (x) => { setExpForm(x); setEditingExp(true); };
  const rmExp = (id) =>
    setDraft((d) => ({ ...d, experience: d.experience.filter((x) => x.id !== id) }));

  // projects
  const setProj = (k) => (e) => setProjForm((f) => ({ ...f, [k]: e.target.value }));
  const submitProj = () => {
    if (!projForm.title.trim()) return;
    const tagsArr = projForm.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const rec = { ...projForm, tags: tagsArr, id: projForm.id || "p" + Date.now() };
    setDraft((d) => ({
      ...d,
      projects: editingProj
        ? d.projects.map((p) => (p.id === rec.id ? rec : p))
        : [rec, ...d.projects],
    }));
    setProjForm(emptyProject());
    setEditingProj(false);
  };
  const editProj = (p) => { setProjForm({ ...p, tags: p.tags.join(", ") }); setEditingProj(true); };
  const rmProj = (id) =>
    setDraft((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));

  const onPickImage = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setImgErr("");
    // Project cover: 16:9
    openCropper(file, 16/9, "Project cover — 16:9", "project");
  };
  const isUploaded = projForm.image.startsWith("data:");

  // Generic file → objectURL → open cropper
  const openCropper = (file, aspect, label, target) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setCropperSrc(url);
    setCropperAspect(aspect);
    setCropperLabel(label);
    setCropperTarget(target);
    setCropperOpen(true);
  };

  const onPickAvatar = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    // Hero image: wide 16:9 ish since it covers full hero area
    openCropper(file, 16/9, "Hero background — รูปเต็มหน้าจอ", "hero");
  };

  const onPickAboutAvatar = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    // About: portrait 3/4
    openCropper(file, 3/4, "About section — รูปคู่กับข้อความ", "about");
  };

  const onCropperConfirm = (croppedUrl) => {
    if (cropperTarget === "hero") {
      setDraft((d) => ({ ...d, profile: { ...d.profile, avatar: croppedUrl } }));
    } else if (cropperTarget === "about") {
      setDraft((d) => ({ ...d, profile: { ...d.profile, avatarAbout: croppedUrl } }));
    } else if (cropperTarget === "project") {
      setProjForm((f) => ({ ...f, image: croppedUrl }));
    }
    URL.revokeObjectURL(cropperSrc);
    setCropperOpen(false);
    setCropperSrc("");
  };

  const onCropperCancel = () => {
    URL.revokeObjectURL(cropperSrc);
    setCropperOpen(false);
    setCropperSrc("");
  };

  return (
    <>
    {cropperOpen && (
      <ImageCropperModal
        src={cropperSrc}
        aspectRatio={cropperAspect}
        previewLabel={cropperLabel}
        onConfirm={onCropperConfirm}
        onCancel={onCropperCancel}
      />
    )}
    <div className="pf-overlay" onClick={onClose}>
      <div className="pf-modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="pf-modal-head">
          <h3 className="pf-display">{unlocked ? "Manage your site" : "Admin access"}</h3>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {unlocked && (
              <button
                className="pf-iconbtn"
                title="Logout"
                onClick={() => {
                  supabase.auth.signOut();
                  setUnlocked(false);
                  setEmail(""); setPassword("");
                }}
              >
                <Lock size={16} />
              </button>
            )}
            <button className="pf-iconbtn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        {!unlocked ? (
          <div>
            <div className="pf-field">
              <label>Email</label>
              <input
                className="pf-input" type="email" value={email} autoFocus
                placeholder="admin@email.com"
                onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") document.getElementById("pf-pw-input")?.focus(); }}
              />
            </div>
            <div className="pf-field">
              <label>Password</label>
              <input
                id="pf-pw-input"
                className="pf-input" type="password" value={password}
                placeholder="••••••••"
                onChange={(e) => { setPassword(e.target.value); setErr(""); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setLoginLoading(true);
                    supabase.auth.signInWithPassword({ email, password })
                      .then(({ error }) => {
                        setLoginLoading(false);
                        if (error) setErr(error.message);
                        else setUnlocked(true);
                      });
                  }
                }}
              />
              {err && <p className="pf-hint" style={{ color: "var(--rust)" }}>{err}</p>}
            </div>
            <button
              className="pf-btn primary"
              disabled={loginLoading}
              onClick={() => {
                setLoginLoading(true);
                supabase.auth.signInWithPassword({ email, password })
                  .then(({ error }) => {
                    setLoginLoading(false);
                    if (error) setErr(error.message);
                    else setUnlocked(true);
                  });
              }}
            >
              <Unlock size={16} /> {loginLoading ? "Logging in…" : "Login"}
            </button>
          </div>
        ) : (
          <div>
            <div className="pf-tabs">
              {TABS.map((t) => (
                <button key={t} className={"pf-tab" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>{t}</button>
              ))}
            </div>

            {/* PROFILE */}
            {tab === "Profile" && (
              <div>
                <div className="pf-field">
                  <label>Hero background photo</label>
                  {/* 16:9 mini preview */}
                  <div style={{
                    width: "100%", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden",
                    border: "1px solid rgba(232,201,160,.15)", background: "#0d0805",
                    backgroundImage: draft.profile.avatar ? `url(${draft.profile.avatar})` : "none",
                    backgroundSize: "cover", backgroundPosition: "center",
                    display: "grid", placeItems: "center", marginBottom: 12, position: "relative",
                  }}>
                    {!draft.profile.avatar && (
                      <span style={{ color: "#8a6f5a", fontSize: 13, letterSpacing: ".1em" }}>ยังไม่มีรูป</span>
                    )}
                    {draft.profile.avatar && (
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(180deg,transparent 40%,rgba(13,8,5,.75))",
                        pointerEvents: "none",
                      }} />
                    )}
                    <div style={{
                      position: "absolute", bottom: 8, left: 10,
                      fontSize: 10, color: "#d8a978", letterSpacing: ".14em",
                      textTransform: "uppercase", opacity: .8,
                    }}>Hero Preview</div>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="pf-btn ghost" onClick={() => avatarRef.current && avatarRef.current.click()}>
                      <Upload size={15} /> Upload & crop
                    </button>
                    {draft.profile.avatar && (
                      <button className="pf-btn ghost" onClick={() => setDraft((d) => ({ ...d, profile: { ...d.profile, avatar: "" } }))}>
                        <Trash2 size={15} /> Remove
                      </button>
                    )}
                    <input ref={avatarRef} type="file" accept="image/*" onChange={onPickAvatar} style={{ display: "none" }} />
                  </div>
                  <p className="pf-hint">อัปโหลดแล้ว crop ให้พอดีกับ hero section (16:9)</p>
                </div>
                <div className="pf-sub">
                  <h4>About Section Photo (optional)</h4>
                  {/* Portrait 3:4 mini preview */}
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{
                      width: 110, aspectRatio: "3/4", borderRadius: 6, overflow: "hidden",
                      border: "1px solid rgba(232,201,160,.15)", background: "#0d0805",
                      backgroundImage: (draft.profile.avatarAbout || draft.profile.avatar)
                        ? `url(${draft.profile.avatarAbout || draft.profile.avatar})` : "none",
                      backgroundSize: "cover", backgroundPosition: "center top",
                      display: "grid", placeItems: "center", flex: "none",
                    }}>
                      {!(draft.profile.avatarAbout || draft.profile.avatar) && (
                        <span style={{ fontSize: 11, color: "#8a6f5a", textAlign: "center", padding: 4 }}>ยังไม่มีรูป</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#d8a978", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>About Preview</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button className="pf-btn ghost" onClick={() => aboutAvatarRef.current && aboutAvatarRef.current.click()}>
                          <Upload size={14} /> Upload & crop
                        </button>
                        {draft.profile.avatarAbout && (
                          <button className="pf-btn ghost" onClick={() => setDraft((d) => ({ ...d, profile: { ...d.profile, avatarAbout: "" } }))}>
                            <X size={14} /> ใช้รูป Hero
                          </button>
                        )}
                      </div>
                      <p className="pf-hint" style={{ marginTop: 8 }}>
                        ถ้าไม่ใส่จะใช้รูป Hero แทน<br/>crop แบบ portrait (3:4)
                      </p>
                    </div>
                  </div>
                  <input ref={aboutAvatarRef} type="file" accept="image/*" onChange={onPickAboutAvatar} style={{ display: "none" }} />
                </div>
                <div className="pf-field">
                  <label>Name</label>
                  <input className="pf-input" value={draft.profile.name} onChange={setProfile("name")} placeholder="Your name" />
                </div>
                <div className="pf-field">
                  <label>Headline (the big serif title)</label>
                  <input className="pf-input" value={draft.profile.headline || ""} onChange={setProfile("headline")} placeholder="Full-Stack Developer & UI Engineer" />
                </div>
                <div className="pf-field">
                  <label>Roles / titles (comma separated)</label>
                  <input
                    className="pf-input"
                    value={draft.profile.roles.join(", ")}
                    onChange={(e) => setDraft((d) => ({ ...d, profile: { ...d.profile, roles: e.target.value.split(",").map((r) => r.replace(/^\s+/, "")) } }))}
                    placeholder="Full-Stack Developer, UI Engineer"
                  />
                </div>
                <div className="pf-field">
                  <label>Tagline (under your headline)</label>
                  <input className="pf-input" value={draft.profile.tagline} onChange={setProfile("tagline")} placeholder="Available for freelance projects worldwide." />
                </div>
                <div className="pf-field">
                  <label>About — lead paragraph (large serif text)</label>
                  <textarea className="pf-textarea" value={draft.profile.about} onChange={setProfile("about")} />
                </div>
                <div className="pf-field">
                  <label>About — secondary paragraph (optional)</label>
                  <textarea className="pf-textarea" value={draft.profile.aboutMore || ""} onChange={setProfile("aboutMore")} placeholder="Your story, background, philosophy…" />
                </div>
                <div className="pf-row">
                  <div className="pf-field">
                    <label>Location</label>
                    <input className="pf-input" value={draft.profile.location} onChange={setProfile("location")} placeholder="Bangkok, TH" />
                  </div>
                  <div className="pf-field">
                    <label>Years of experience</label>
                    <input className="pf-input" value={draft.profile.years} onChange={setProfile("years")} placeholder="5+" />
                  </div>
                </div>
                <div className="pf-field">
                  <label>Recognitions stat (hero, e.g. "12" — leave blank to show project count)</label>
                  <input className="pf-input" value={draft.profile.nominations || ""} onChange={setProfile("nominations")} placeholder="12" />
                </div>
              </div>
            )}

            {/* CONTACT */}
            {tab === "Contact" && (
              <div>
                <div className="pf-field">
                  <label>Email</label>
                  <input className="pf-input" value={draft.contact.email} onChange={setContactF("email")} placeholder="you@example.com" />
                </div>
                <div className="pf-field">
                  <label>GitHub URL</label>
                  <input className="pf-input" value={draft.contact.github} onChange={setContactF("github")} placeholder="https://github.com/yourname" />
                </div>
                <div className="pf-field">
                  <label>LinkedIn URL</label>
                  <input className="pf-input" value={draft.contact.linkedin} onChange={setContactF("linkedin")} placeholder="https://linkedin.com/in/yourname" />
                </div>
                <p className="pf-hint">Leave a field blank to hide that button.</p>
              </div>
            )}

            {/* SKILLS */}
            {tab === "Skills" && (
              <div>
                <label className="pf-mono" style={{ fontSize: 12, color: "var(--muted)" }}>Tech stack ({draft.skills.length})</label>
                <div className="pf-skilledit" style={{ marginTop: 12 }}>
                  {draft.skills.map((s, i) => (
                    <span className="pf-chip" key={s + i}>
                      <SkillIcon name={s} size={18} /> {s}
                      <span className="rm" onClick={() => rmSkill(i)}><X size={13} /></span>
                    </span>
                  ))}
                  {draft.skills.length === 0 && <p className="pf-hint">No skills yet — add some below.</p>}
                </div>
                <div className="pf-row" style={{ gridTemplateColumns: "1fr auto", alignItems: "end" }}>
                  <div className="pf-field" style={{ marginBottom: 0 }}>
                    <label>Add a skill</label>
                    <input
                      className="pf-input" value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") addSkill(); }}
                      placeholder="e.g. Rust"
                    />
                  </div>
                  <button className="pf-btn primary" onClick={addSkill}><Plus size={16} /> Add</button>
                </div>
              </div>
            )}

            {/* HIGHLIGHTS */}
            {tab === "Highlights" && (
              <div>
                <p className="pf-hint" style={{ marginBottom: 16, marginTop: 0 }}>
                  Awards, talks, certifications, recognitions — anything worth a one-liner.
                </p>
                {(draft.highlights || []).map((h, i) => (
                  <div className="pf-row" key={h.id || i} style={{ gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 10, alignItems: "center" }}>
                    <input
                      className="pf-input"
                      value={h.text}
                      onChange={(e) => {
                        const v = e.target.value;
                        setDraft((d) => ({
                          ...d,
                          highlights: d.highlights.map((x, idx) => idx === i ? { ...x, text: v } : x),
                        }));
                      }}
                      placeholder="e.g. Best Hackathon Project, TechCrunch Disrupt (2024)"
                    />
                    <button
                      className="pf-mini del"
                      onClick={() => setDraft((d) => ({ ...d, highlights: d.highlights.filter((_, idx) => idx !== i) }))}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button
                  className="pf-btn ghost"
                  onClick={() => setDraft((d) => ({
                    ...d,
                    highlights: [...(d.highlights || []), { id: "h" + Date.now(), text: "" }],
                  }))}
                >
                  <Plus size={15} /> Add highlight
                </button>
              </div>
            )}

            {/* EXPERIENCE */}
            {tab === "Experience" && (
              <div>
                <div className="pf-sub">
                  <h4 className="pf-display">{editingExp ? "Edit role" : "Add a role"}</h4>
                  <div className="pf-row">
                    <div className="pf-field">
                      <label>Role / position</label>
                      <input className="pf-input" value={expForm.role} onChange={(e) => setExpForm((f) => ({ ...f, role: e.target.value }))} placeholder="Frontend Developer" />
                    </div>
                    <div className="pf-field">
                      <label>Company</label>
                      <input className="pf-input" value={expForm.company} onChange={(e) => setExpForm((f) => ({ ...f, company: e.target.value }))} placeholder="Acme Inc." />
                    </div>
                  </div>
                  <div className="pf-field">
                    <label>Period</label>
                    <input className="pf-input" value={expForm.period} onChange={(e) => setExpForm((f) => ({ ...f, period: e.target.value }))} placeholder="2023 — Present" />
                  </div>
                  <div className="pf-field">
                    <label>Description</label>
                    <textarea className="pf-textarea" value={expForm.description} onChange={(e) => setExpForm((f) => ({ ...f, description: e.target.value }))} placeholder="What you did there" />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="pf-btn primary" onClick={submitExp}>
                      {editingExp ? <><Check size={16} /> Update</> : <><Plus size={16} /> Add role</>}
                    </button>
                    {editingExp && <button className="pf-btn ghost" onClick={() => { setExpForm(emptyExp()); setEditingExp(false); }}>Cancel</button>}
                  </div>
                </div>
                {draft.experience.map((x) => (
                  <div className="pf-adminitem" key={x.id}>
                    <div className="sw" style={{ background: "linear-gradient(135deg,var(--gold),var(--rust))" }}><Briefcase size={16} /></div>
                    <div className="meta">
                      <b>{x.role}</b>
                      <span>{x.company} · {x.period}</span>
                    </div>
                    <button className="pf-mini" onClick={() => editExp(x)} title="Edit"><Pencil size={15} /></button>
                    <button className="pf-mini del" onClick={() => rmExp(x.id)} title="Delete"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            )}

            {/* PROJECTS */}
            {tab === "Projects" && (
              <div>
                <div className="pf-sub">
                  <h4 className="pf-display">{editingProj ? "Edit project" : "Add a project"}</h4>
                  <div className="pf-field">
                    <label>Title</label>
                    <input className="pf-input" value={projForm.title} onChange={setProj("title")} placeholder="Project name" />
                  </div>
                  <div className="pf-field">
                    <label>Description</label>
                    <textarea className="pf-textarea" value={projForm.description} onChange={setProj("description")} placeholder="What is it? What did you build?" />
                  </div>
                  <div className="pf-row">
                    <div className="pf-field">
                      <label>Tech (comma separated)</label>
                      <input className="pf-input" value={projForm.tags} onChange={setProj("tags")} placeholder="React, Node.js" />
                    </div>
                    <div className="pf-field">
                      <label>Category</label>
                      <input className="pf-input" value={projForm.category} onChange={setProj("category")} placeholder="Web App" />
                    </div>
                  </div>
                  <div className="pf-row">
                    <div className="pf-field">
                      <label>Live demo URL</label>
                      <input className="pf-input" value={projForm.demoUrl} onChange={setProj("demoUrl")} placeholder="https://" />
                    </div>
                    <div className="pf-field">
                      <label>Repo URL</label>
                      <input className="pf-input" value={projForm.repoUrl} onChange={setProj("repoUrl")} placeholder="https://github.com/" />
                    </div>
                  </div>
                  <div className="pf-field">
                    <label>Cover image</label>
                    {/* 16:9 project cover preview */}
                    <div style={{
                      width: "100%", aspectRatio: "16/9", borderRadius: 6, overflow: "hidden",
                      border: "1px solid rgba(232,201,160,.15)", background: projForm.image
                        ? "none"
                        : `linear-gradient(135deg,${projForm.accent[0]},${projForm.accent[1]})`,
                      backgroundImage: projForm.image ? `url(${projForm.image})` : "none",
                      backgroundSize: "cover", backgroundPosition: "center",
                      display: "grid", placeItems: "center", marginBottom: 10, position: "relative",
                    }}>
                      {!projForm.image && (
                        <span style={{
                          fontFamily: "'Playfair Display',serif", fontWeight: 700,
                          fontSize: 42, color: "rgba(255,243,228,.85)",
                        }}>{projForm.title ? projForm.title.charAt(0) : "?"}</span>
                      )}
                      <div style={{
                        position: "absolute", bottom: 8, left: 10,
                        fontSize: 10, color: "#d8a978", letterSpacing: ".12em",
                        textTransform: "uppercase", opacity: .75,
                      }}>Project Cover Preview</div>
                      {projForm.image && (
                        <button
                          onClick={() => { setProjForm((f) => ({ ...f, image: "" })); setImgErr(""); }}
                          style={{
                            position: "absolute", top: 8, right: 8,
                            background: "rgba(13,8,5,.75)", border: "1px solid rgba(232,201,160,.2)",
                            color: "#b3a08d", borderRadius: 6, padding: "5px 10px", cursor: "pointer",
                            fontSize: 11, display: "flex", alignItems: "center", gap: 5,
                          }}
                        >
                          <Trash2 size={12} /> ลบรูป
                        </button>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button className="pf-btn ghost" onClick={() => fileRef.current && fileRef.current.click()}>
                        <Upload size={15} /> Upload & crop
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} style={{ display: "none" }} />
                    </div>
                    <input
                      className="pf-input" style={{ marginTop: 10 }}
                      value={isUploaded ? "" : projForm.image}
                      onChange={setProj("image")}
                      disabled={isUploaded}
                      placeholder={isUploaded ? "Using uploaded image" : "...or paste an image URL"}
                    />
                    {imgErr
                      ? <p className="pf-hint" style={{ color: "var(--rust)" }}>{imgErr}</p>
                      : <p className="pf-hint">ถ้าไม่ใส่จะใช้สี accent แทน</p>}
                  </div>
                  <div className="pf-field">
                    <label>Accent color</label>
                    <div className="pf-swatches">
                      {ACCENTS.map((a, i) => (
                        <div key={i}
                          className={"pf-swatch" + (projForm.accent[0] === a[0] && projForm.accent[1] === a[1] ? " on" : "")}
                          style={{ background: `linear-gradient(135deg, ${a[0]}, ${a[1]})` }}
                          onClick={() => setProjForm((f) => ({ ...f, accent: a }))}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="pf-btn primary" onClick={submitProj}>
                      {editingProj ? <><Check size={16} /> Update</> : <><Plus size={16} /> Add project</>}
                    </button>
                    {editingProj && <button className="pf-btn ghost" onClick={() => { setProjForm(emptyProject()); setEditingProj(false); }}>Cancel</button>}
                  </div>
                </div>
                {draft.projects.map((p) => (
                  <div className="pf-adminitem" key={p.id}>
                    <div className="sw" style={{ background: `linear-gradient(135deg, ${p.accent[0]}, ${p.accent[1]})` }} />
                    <div className="meta">
                      <b>{p.title}</b>
                      <span>{p.category} · {p.tags.join(", ")}</span>
                    </div>
                    <button className="pf-mini" onClick={() => editProj(p)} title="Edit"><Pencil size={15} /></button>
                    <button className="pf-mini del" onClick={() => rmProj(p.id)} title="Delete"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            )}

            {/* SAVE BAR */}
            <div className="pf-savebar">
              <button className="pf-btn primary" onClick={commit}><Check size={16} /> Save changes</button>
              {savedFlash && <span className="pf-saved"><Check size={14} /> {"Saved"}</span>}
              <span className="pf-hint" style={{ margin: 0 }}>
                {"Saved to Supabase ✓"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
