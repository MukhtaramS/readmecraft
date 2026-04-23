"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import TemplatePreviewModal from "./TemplatePreviewModal";
import MagneticButton from "./MagneticButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Copy, Download, Check,
  Eye, Code, Zap, BarChart2, AtSign, Wrench, Info, User,
  Trophy, Plus, X, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

// ─── Section system ───────────────────────────────────────────────────────────

const SECTION_ORDER = ["intro", "about", "skills", "stats", "trophies", "connect", "visitor"] as const;
type SectionId = (typeof SECTION_ORDER)[number];

const SECTION_META: Record<SectionId, { label: string; icon: React.ReactNode; description: string }> = {
  intro:    { label: "Intro",             icon: <User size={14} />,      description: "Name, title & tagline" },
  about:    { label: "About Me",          icon: <Info size={14} />,      description: "What you're building, learning, and loving" },
  skills:   { label: "Tech Stack",        icon: <Wrench size={14} />,    description: "Your languages, frameworks & tools" },
  stats:    { label: "GitHub Stats",      icon: <BarChart2 size={14} />, description: "Stats card, streak & top languages" },
  trophies: { label: "GitHub Trophies",   icon: <Trophy size={14} />,    description: "Trophy showcase from your GitHub" },
  connect:  { label: "Connect",           icon: <AtSign size={14} />,    description: "LinkedIn, Twitter, email & portfolio" },
  visitor:  { label: "Visitor Counter",   icon: <Eye size={14} />,       description: "Profile view counter badge" },
};

// ─── Templates ────────────────────────────────────────────────────────────────

const TEMPLATES: {
  id: string;
  name: string;
  description: string;
  tags: string[];
  accentColor: string;
  cardBg: string;
  infoBg: string;
  infoText: string;
  infoSub: string;
  infoBorder: string;
  tagBg: string;
  tagText: string;
  previewMd: string;
  sections: SectionId[];
  sampleData: Partial<ProfileData>;
}[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean text layout with emoji bullets and a simple intro.",
    tags: ["Beginner-friendly", "No GitHub account needed", "Quick setup"],
    accentColor: "#3b82f6",
    cardBg: "#0d1117",
    infoBg: "rgba(13,17,23,0.92)",
    infoText: "#e6edf3",
    infoSub: "#8b949e",
    infoBorder: "rgba(48,54,61,0.8)",
    tagBg: "rgba(59,130,246,0.12)",
    tagText: "#79c0ff",
    sections: ["intro", "about", "skills", "connect"],
    sampleData: {
      name: "Alex Chen", title: "Frontend Developer",
      tagline: "Building fast, accessible UIs that users love.",
      workingOn: "a design system in React", learning: "WebGL & Three.js",
      askMe: "React, CSS architecture, accessibility",
      funFact: "I debug best at 2am with lo-fi music",
      skills: ["js", "ts", "react", "nextjs", "tailwind", "html", "css", "vite", "figma", "git"],
      linkedin: "alexchen", twitter: "alexchen",
    },
    previewMd: `# Hey there, I'm Alex 👋

> Frontend Developer · Open Source Enthusiast · Coffee Powered ☕

---

- 🔭 Currently working on **a design system in React**
- 🌱 Learning **WebGL & Three.js**
- 💬 Ask me about **React, CSS architecture, accessibility**
- 🎯 Goal: Ship an OSS project with 1k stars
- ⚡ Fun fact: I debug best at 2am with lo-fi music

---

### 🛠 Tech Stack

\`JavaScript\` · \`TypeScript\` · \`React\` · \`Next.js\` · \`Tailwind CSS\`

\`Node.js\` · \`PostgreSQL\` · \`Docker\` · \`Figma\` · \`Git\`

---

### 📫 Let's connect

[![Twitter](https://img.shields.io/badge/-@alexchen-1DA1F2?logo=twitter&logoColor=white&style=flat)](https://twitter.com)
[![LinkedIn](https://img.shields.io/badge/-alexchen-0077B5?logo=linkedin&logoColor=white&style=flat)](https://linkedin.com)`,
  },
  {
    id: "stats",
    name: "Stats Heavy",
    description: "GitHub stats cards, language chart, streak, and contribution graph.",
    tags: ["Stats required", "GitHub username needed", "Data-driven"],
    accentColor: "#fe428e",
    cardBg: "#0d1117",
    infoBg: "rgba(13,17,23,0.92)",
    infoText: "#e6edf3",
    infoSub: "#8b949e",
    infoBorder: "rgba(48,54,61,0.8)",
    tagBg: "rgba(254,66,142,0.12)",
    tagText: "#fe428e",
    sections: ["intro", "about", "skills", "stats", "connect"],
    sampleData: {
      name: "Jordan Patel", title: "Full-Stack Engineer",
      tagline: "I ship end-to-end — from database schemas to pixel-perfect UIs.",
      workingOn: "an open-source SaaS starter kit", learning: "Rust & WebAssembly",
      askMe: "system design, databases, API architecture",
      funFact: "My side projects have more tests than my day job",
      skills: ["ts", "react", "nextjs", "nodejs", "postgres", "redis", "docker", "aws", "prisma", "git"],
      githubUsername: "jordanpatel", showStats: true, showStreak: true, showTopLangs: true,
      linkedin: "jordanpatel", twitter: "jordanpatel",
    },
    previewMd: `# Hi, I'm Jordan 👋

> Full-Stack Engineer · I ship end-to-end · From DB schemas to pixel-perfect UIs.

---

### 📊 GitHub Stats

| Metric | Value |
|--------|-------|
| ⭐ Total Stars | 4,127 |
| 🔄 Total Commits | 15,203 |
| ⬆ Pull Requests | 96 |
| ⚠️ Issues Opened | 234 |

### 🔤 Top Languages

| Language | Usage |
|----------|-------|
| TypeScript | ████████░░ 71% |
| JavaScript | ██░░░░░░░░ 21% |
| Rust | ░░░░░░░░░░ 5% |

### 🔥 Current streak: **47 days** · Longest: **103 days**

---

### 🏆 Achievements

\`1000+ Commits\` · \`Pull Shark\` · \`Pair Extraordinaire\` · \`Arctic Code Vault\`

---

### 🛠 Tools

\`TypeScript\` \`React\` \`Next.js\` \`Node.js\` \`PostgreSQL\` \`Redis\` \`Docker\` \`AWS\`

---

[![LinkedIn](badge)](link) [![Twitter](badge)](link) [![YouTube](badge)](link)`,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Centered layout, visitor counter, animated typing text.",
    tags: ["Eye-catching", "Image-heavy", "Great for creators"],
    accentColor: "#a78bfa",
    cardBg: "#0d0221",
    infoBg: "rgba(13,2,33,0.92)",
    infoText: "#e6edf3",
    infoSub: "#8b949e",
    infoBorder: "rgba(88,28,135,0.5)",
    tagBg: "rgba(167,139,250,0.12)",
    tagText: "#a78bfa",
    sections: ["intro", "about", "skills", "connect", "visitor"],
    sampleData: {
      name: "Sam Rivera", title: "Open Source Engineer",
      tagline: "Code in the open. Build for everyone.",
      workingOn: "dev tools that reduce friction for engineers",
      learning: "compilers and programming language theory",
      askMe: "Go, CLI tooling, open source sustainability",
      funFact: "My first PR was a typo fix — now I'm a maintainer of that project",
      skills: ["go", "py", "rust", "docker", "linux", "git", "github", "githubactions"],
      githubUsername: "samrivera",
      linkedin: "samrivera", twitter: "samrivera", email: "sam@example.dev",
    },
    previewMd: `<div align="center">

# Hello World! I'm Sam 🌊

*Open Source Engineer · Building in public · San Francisco*

---

\`\`\`text
while (alive) { eat(); sleep(); code(); repeat(); }
\`\`\`

> 👁 **770,332** profile visits and counting

---

</div>

### 🧑 About Me

> I'm Sam from San Francisco — open source engineer who codes in the open.

- 🧑‍💻 Working on **dev tools that reduce friction for engineers**
- 📚 Learning **compilers & programming language theory**
- 🌱 Love contributing to open source in my spare time
- ⚡ Fun fact: My first PR was a typo fix — now I maintain that project

---

### 🛠 My Stack

\`Go\` · \`Rust\` · \`Python\` · \`Docker\` · \`Linux\` · \`GitHub Actions\`

---

### 🤝 Connect with me

[![LinkedIn](badge)](link) [![Twitter](badge)](link) [![Email](badge)](link)`,
  },
  {
    id: "developer",
    name: "Developer",
    description: "Tech stack grid, project highlights, and code philosophy.",
    tags: ["Tech-focused", "Project showcase", "Senior-friendly"],
    accentColor: "#22d3ee",
    cardBg: "#020a12",
    infoBg: "rgba(2,10,18,0.92)",
    infoText: "#e6edf3",
    infoSub: "#8b949e",
    infoBorder: "rgba(34,211,238,0.15)",
    tagBg: "rgba(34,211,238,0.10)",
    tagText: "#67e8f9",
    sections: ["intro", "skills", "stats", "connect"],
    sampleData: {
      name: "Morgan Lee", title: "Senior Software Engineer",
      tagline: "Turning complex problems into clean, scalable solutions.",
      workingOn: "a distributed tracing library", learning: "eBPF and kernel programming",
      askMe: "distributed systems, TypeScript, cloud architecture",
      funFact: "I have more GitHub stars than Instagram followers",
      skills: ["ts", "nextjs", "tailwind", "svelte", "graphql", "go", "rust", "nestjs", "py", "aws", "docker", "postgres"],
      githubUsername: "morganlee", showStats: true, showStreak: true, showTopLangs: true,
      linkedin: "morganlee", twitter: "morganlee",
    },
    previewMd: `# Morgan Lee · Senior Software Engineer 🚀

> Turning complex problems into clean, scalable solutions.

_"Code should be clear before it is clever."_

---

### 💻 I Build With

| Frontend | Backend | Database | Cloud |
|----------|---------|----------|-------|
| TypeScript | Go | PostgreSQL | AWS |
| React | Rust | Redis | Docker |
| Next.js | Node.js | MongoDB | Kubernetes |
| Tailwind | GraphQL | Prisma | Terraform |

---

### 🔭 Currently Building

- [**distributed-trace**](#) — Lightweight tracing for Node.js microservices
- [**ts-toolkit**](#) — TypeScript utilities, now open source

---

### 📝 How I Work

\`\`\`text
Languages:   TypeScript, Go, Rust, Python
Editors:     VS Code, Neovim
Principles:  Clean Code, TDD, Ship Early & Iterate
\`\`\`

---

[![GitHub](badge)](link) [![LinkedIn](badge)](link) [![Blog](badge)](link)`,
  },
  {
    id: "social",
    name: "Social",
    description: "Prominent social badges, blog links, and community-first CTA.",
    tags: ["Content creator", "Community builder", "Blog + links"],
    accentColor: "#f59e0b",
    cardBg: "#0a0800",
    infoBg: "rgba(10,8,0,0.92)",
    infoText: "#e6edf3",
    infoSub: "#8b949e",
    infoBorder: "rgba(245,158,11,0.2)",
    tagBg: "rgba(245,158,11,0.12)",
    tagText: "#fbbf24",
    sections: ["intro", "about", "connect", "visitor"],
    sampleData: {
      name: "Casey Kim", title: "Developer & Content Creator",
      tagline: "Building in public. Teaching what I learn.",
      workingOn: "a course on full-stack development", learning: "video editing & storytelling",
      askMe: "content creation, developer communities, Next.js",
      funFact: "My most viral tweet was about a CSS bug",
      skills: ["js", "ts", "react", "nextjs", "tailwind", "figma", "git"],
      linkedin: "caseykim", twitter: "caseykim", email: "casey@example.dev",
    },
    previewMd: `<div align="center">

# Hey, I'm Casey 👋

**Developer · Content Creator · Community Builder**

---

### 🌐 Find Me On The Internet

[![Twitter](https://img.shields.io/badge/Twitter-@caseydev-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com)
[![YouTube](https://img.shields.io/badge/YouTube-CaseyDev-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-casey-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com)
[![Dev.to](https://img.shields.io/badge/Dev.to-casey-0A0A0A?style=for-the-badge&logo=dev.to&logoColor=white)](https://dev.to)
[![Discord](https://img.shields.io/badge/Discord-casey%239234-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com)

---

</div>

### ✍️ Latest Blog Posts

- 🔥 [**How I got 10k GitHub stars in 3 months**](https://dev.to) — *2.4k reads*
- 💡 [**The developer tools I use every single day**](https://dev.to) — *1.8k reads*
- 🌱 [**Why open source changed my career**](https://dev.to) — *1.1k reads*

---

### 💬 Let's Collaborate

> Open to: **speaking · mentorship · open source · consulting**

📧 casey@example.dev · 📍 Austin, TX

---

### 📊 Profile Stats

![Profile Views](https://komarev.com/ghpvc/?username=caseydev&color=orange&style=flat-square)
![GitHub followers](https://img.shields.io/github/followers/caseydev?style=flat-square&color=orange)`,
  },
];

// ─── Skill definitions ────────────────────────────────────────────────────────

const SKILL_CATEGORIES: { label: string; skills: { id: string; name: string }[] }[] = [
  {
    label: "Languages",
    skills: [
      { id: "js", name: "JavaScript" }, { id: "ts", name: "TypeScript" },
      { id: "py", name: "Python" }, { id: "go", name: "Go" },
      { id: "rust", name: "Rust" }, { id: "java", name: "Java" },
      { id: "cpp", name: "C++" }, { id: "cs", name: "C#" },
      { id: "swift", name: "Swift" }, { id: "kotlin", name: "Kotlin" },
      { id: "php", name: "PHP" }, { id: "rb", name: "Ruby" }, { id: "dart", name: "Dart" },
    ],
  },
  {
    label: "Frontend",
    skills: [
      { id: "react", name: "React" }, { id: "nextjs", name: "Next.js" },
      { id: "vue", name: "Vue" }, { id: "nuxtjs", name: "Nuxt.js" },
      { id: "svelte", name: "Svelte" }, { id: "angular", name: "Angular" },
      { id: "html", name: "HTML" }, { id: "css", name: "CSS" },
      { id: "tailwind", name: "Tailwind" }, { id: "vite", name: "Vite" },
    ],
  },
  {
    label: "Backend",
    skills: [
      { id: "nodejs", name: "Node.js" }, { id: "express", name: "Express" },
      { id: "nestjs", name: "NestJS" }, { id: "fastapi", name: "FastAPI" },
      { id: "django", name: "Django" }, { id: "flask", name: "Flask" },
      { id: "spring", name: "Spring" }, { id: "laravel", name: "Laravel" },
      { id: "bun", name: "Bun" }, { id: "deno", name: "Deno" },
    ],
  },
  {
    label: "Database",
    skills: [
      { id: "postgres", name: "PostgreSQL" }, { id: "mysql", name: "MySQL" },
      { id: "mongo", name: "MongoDB" }, { id: "redis", name: "Redis" },
      { id: "sqlite", name: "SQLite" }, { id: "firebase", name: "Firebase" },
      { id: "supabase", name: "Supabase" }, { id: "prisma", name: "Prisma" },
    ],
  },
  {
    label: "DevOps & Cloud",
    skills: [
      { id: "docker", name: "Docker" }, { id: "kubernetes", name: "Kubernetes" },
      { id: "aws", name: "AWS" }, { id: "gcp", name: "GCP" },
      { id: "azure", name: "Azure" }, { id: "vercel", name: "Vercel" },
      { id: "netlify", name: "Netlify" }, { id: "githubactions", name: "GH Actions" },
      { id: "terraform", name: "Terraform" }, { id: "linux", name: "Linux" },
    ],
  },
  {
    label: "Tools",
    skills: [
      { id: "git", name: "Git" }, { id: "github", name: "GitHub" },
      { id: "vscode", name: "VS Code" }, { id: "figma", name: "Figma" },
      { id: "postman", name: "Postman" }, { id: "jest", name: "Jest" },
      { id: "graphql", name: "GraphQL" },
    ],
  },
];

// ─── ProfileData ──────────────────────────────────────────────────────────────

type ProfileData = {
  name: string; title: string; tagline: string;
  workingOn: string; learning: string; askMe: string; funFact: string; portfolio: string;
  skills: string[];
  githubUsername: string; showStats: boolean; showStreak: boolean; showTopLangs: boolean;
  twitter: string; linkedin: string; email: string;
};

const DEFAULT_DATA: ProfileData = {
  name: "", title: "", tagline: "",
  workingOn: "", learning: "", askMe: "", funFact: "", portfolio: "",
  skills: [],
  githubUsername: "", showStats: true, showStreak: true, showTopLangs: true,
  twitter: "", linkedin: "", email: "",
};

type Props = { onBack: () => void };

// ─── Markdown generator ───────────────────────────────────────────────────────

function generateMarkdown(d: ProfileData, activeSections: SectionId[]): string {
  if (!d.name && !d.title) return "";
  const has = (s: SectionId) => activeSections.includes(s);
  const lines: string[] = [];

  // Intro
  lines.push(`# Hi, I'm ${d.name || "Your Name"} 👋`);
  lines.push("");
  if (d.title) { lines.push(`**${d.title}**`); lines.push(""); }
  if (d.tagline) { lines.push(`> ${d.tagline}`); lines.push(""); }
  lines.push("---");
  lines.push("");

  // About
  if (has("about")) {
    const bullets: string[] = [];
    if (d.workingOn) bullets.push(`- 🔭 Currently working on **${d.workingOn}**`);
    if (d.learning) bullets.push(`- 🌱 Currently learning **${d.learning}**`);
    if (d.askMe) bullets.push(`- 💬 Ask me about **${d.askMe}**`);
    if (d.portfolio) bullets.push(`- 🌐 Portfolio: [${d.portfolio}](${d.portfolio})`);
    if (d.funFact) bullets.push(`- ⚡ Fun fact: *${d.funFact}*`);
    if (bullets.length > 0) {
      lines.push("## About Me"); lines.push(""); lines.push(...bullets); lines.push("");
    }
  }

  // Skills
  if (has("skills") && d.skills.length > 0) {
    lines.push("## Tech Stack"); lines.push("");
    lines.push(`[![My Skills](https://skillicons.dev/icons?i=${d.skills.join(",")})](https://skillicons.dev)`);
    lines.push("");
  }

  // Stats
  if (has("stats") && d.githubUsername) {
    const u = d.githubUsername;
    lines.push("## GitHub Stats"); lines.push("");
    if (d.showStats) lines.push(`![Stats](https://github-readme-stats.vercel.app/api?username=${u}&theme=dark&hide_border=true&include_all_commits=true&count_private=true)`);
    if (d.showStreak) lines.push(`![Streak](https://github-readme-streak-stats.herokuapp.com/?user=${u}&theme=dark&hide_border=true)`);
    if (d.showTopLangs) lines.push(`![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${u}&theme=dark&hide_border=true&layout=compact)`);
    lines.push("");
  }

  // Trophies
  if (has("trophies") && d.githubUsername) {
    lines.push("## GitHub Trophies"); lines.push("");
    lines.push(`[![Trophies](https://github-profile-trophy.vercel.app/?username=${d.githubUsername}&theme=flat&no-frame=true&column=6)](https://github.com/ryo-ma/github-profile-trophy)`);
    lines.push("");
  }

  // Visitor
  if (has("visitor") && d.githubUsername) {
    lines.push(`![Visitor Count](https://komarev.com/ghpvc/?username=${d.githubUsername}&color=blue&style=flat)`);
    lines.push("");
  }

  // Connect
  if (has("connect")) {
    const badges: string[] = [];
    if (d.linkedin) badges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${d.linkedin})`);
    if (d.twitter) badges.push(`[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${d.twitter})`);
    if (d.email) badges.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${d.email})`);
    if (d.portfolio) badges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](${d.portfolio})`);
    if (badges.length > 0) {
      lines.push("## Connect with Me"); lines.push(""); lines.push(badges.join(" ")); lines.push("");
    }
  }

  return lines.join("\n");
}

// ─── Small UI pieces ──────────────────────────────────────────────────────────

function Field({ label, placeholder, value, onChange, hint }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; hint?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 dark:text-zinc-400 mb-1">{label}</label>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-colors shadow-sm"
      />
      {hint && <p className="mt-1 text-[10px] text-gray-400 dark:text-zinc-600">{hint}</p>}
    </div>
  );
}

function SkillChip({ id, name, selected, onToggle }: {
  id: string; name: string; selected: boolean; onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} title={name}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] transition-all ${
        selected
          ? "border-blue-400 dark:border-blue-500/60 bg-blue-50 dark:bg-blue-600/10 text-blue-700 dark:text-white shadow-sm"
          : "border-gray-200 dark:border-zinc-700/40 bg-white dark:bg-zinc-800/40 text-gray-600 dark:text-zinc-500 hover:border-gray-300 dark:hover:border-zinc-600 hover:text-gray-800 dark:hover:text-zinc-300"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://skillicons.dev/icons?i=${id}`} alt={name} className="w-4 h-4 object-contain" />
      {name}
    </button>
  );
}

// ─── Section form content ─────────────────────────────────────────────────────

function SectionFields({ id, data, set }: {
  id: SectionId; data: ProfileData; set: (p: Partial<ProfileData>) => void;
}) {
  if (id === "intro") return (
    <div className="space-y-3">
      <Field label="Your name" placeholder="Alex Chen" value={data.name} onChange={(v) => set({ name: v })} />
      <Field label="Title / role" placeholder="Full-Stack Engineer" value={data.title} onChange={(v) => set({ title: v })} />
      <Field label="Tagline" placeholder="Building tools that make developers faster." value={data.tagline} onChange={(v) => set({ tagline: v })} />
    </div>
  );

  if (id === "about") return (
    <div className="space-y-3">
      <Field label="Currently working on" placeholder="an open-source CLI tool" value={data.workingOn} onChange={(v) => set({ workingOn: v })} />
      <Field label="Currently learning" placeholder="Rust and WebAssembly" value={data.learning} onChange={(v) => set({ learning: v })} />
      <Field label="Ask me about" placeholder="React, system design, TypeScript" value={data.askMe} onChange={(v) => set({ askMe: v })} />
      <Field label="Fun fact" placeholder="I've shipped 12 side projects and finished 0" value={data.funFact} onChange={(v) => set({ funFact: v })} />
      <Field label="Portfolio URL" placeholder="https://yoursite.dev" value={data.portfolio} onChange={(v) => set({ portfolio: v })} />
    </div>
  );

  if (id === "skills") return (
    <div className="space-y-3">
      {data.skills.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800/40 rounded-lg border border-gray-100 dark:border-zinc-700/30">
          <span className="text-[10px] text-gray-500 dark:text-zinc-500">{data.skills.length} selected</span>
          <button onClick={() => set({ skills: [] })} className="text-[10px] text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors">Clear all</button>
        </div>
      )}
      {SKILL_CATEGORIES.map((cat) => (
        <div key={cat.label}>
          <p className="text-[10px] font-medium text-gray-400 dark:text-zinc-600 uppercase tracking-wide mb-1.5">{cat.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {cat.skills.map((skill) => (
              <SkillChip key={skill.id} id={skill.id} name={skill.name}
                selected={data.skills.includes(skill.id)}
                onToggle={() => set({ skills: data.skills.includes(skill.id) ? data.skills.filter((s) => s !== skill.id) : [...data.skills, skill.id] })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (id === "stats") return (
    <div className="space-y-3">
      <Field label="GitHub username" placeholder="octocat" value={data.githubUsername} onChange={(v) => set({ githubUsername: v })} hint="Required for all stat cards" />
      {(["showStats", "showStreak", "showTopLangs"] as const).map((key, i) => (
        <label key={key} className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={data[key]} onChange={() => set({ [key]: !data[key] })}
            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 accent-blue-500" />
          <span className="text-xs text-gray-600 dark:text-zinc-400">
            {["Stats card", "Streak card", "Top languages"][i]}
          </span>
        </label>
      ))}
    </div>
  );

  if (id === "trophies") return (
    <div>
      <Field label="GitHub username" placeholder="octocat" value={data.githubUsername} onChange={(v) => set({ githubUsername: v })} hint="Same username used for stats" />
    </div>
  );

  if (id === "connect") return (
    <div className="space-y-3">
      <Field label="LinkedIn username" placeholder="alexchen" value={data.linkedin} onChange={(v) => set({ linkedin: v })} hint="linkedin.com/in/username" />
      <Field label="Twitter / X handle" placeholder="alexchen" value={data.twitter} onChange={(v) => set({ twitter: v })} />
      <Field label="Email" placeholder="hello@alexchen.dev" value={data.email} onChange={(v) => set({ email: v })} />
      <Field label="Portfolio URL" placeholder="https://yoursite.dev" value={data.portfolio} onChange={(v) => set({ portfolio: v })} />
    </div>
  );

  if (id === "visitor") return (
    <div>
      <Field label="GitHub username" placeholder="octocat" value={data.githubUsername} onChange={(v) => set({ githubUsername: v })} hint="Used to count profile views" />
    </div>
  );

  return null;
}

// ─── Step 1: Template picker (horizontal gallery) ─────────────────────────────

function TemplatePicker({ onPick, onBack }: {
  onPick: (t: typeof TEMPLATES[number]) => void;
  onBack: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [modalTemplate, setModalTemplate] = useState<typeof TEMPLATES[number] | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [currentCard, setCurrentCard] = useState(1);
  const [cardsReady, setCardsReady] = useState(false);

  const NEW_PROFILE_IDS = new Set(["developer", "social"]);

  const CARD_W = 400;
  const GAP = 20;

  useEffect(() => {
    requestAnimationFrame(() => setCardsReady(true));
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });
  };

  const focusCard = (idx: number) => {
    const clamped = Math.max(0, Math.min(TEMPLATES.length - 1, idx));
    cardRefs.current[clamped]?.focus();
    scrollRef.current?.scrollTo({ left: clamped * (CARD_W + GAP), behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 20);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
    setCurrentCard(Math.round(el.scrollLeft / (CARD_W + GAP)) + 1);
  };

  const selectedTemplate = picked ? TEMPLATES.find((t) => t.id === picked) ?? null : null;

  return (
    <>
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800/60"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-purple-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Profile README templates</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
              Scroll to browse · Click to select · Fill in your details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 tabular-nums">{currentCard} / {TEMPLATES.length}</span>
          <MagneticButton
            onClick={() => selectedTemplate && setModalTemplate(selectedTemplate)}
            disabled={!picked}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={
              picked
                ? { background: selectedTemplate?.accentColor ?? "#a78bfa", color: "#fff" }
                : { background: "transparent", color: "#9ca3af", border: "1px solid #3f3f46", cursor: "not-allowed" }
            }
          >
            {picked ? (
              <><Check size={15} /> Customize &ldquo;{selectedTemplate?.name}&rdquo;</>
            ) : (
              <>Select a template <ArrowRight size={15} /></>
            )}
          </MagneticButton>
        </div>
      </div>

      {/* Gallery */}
      <div className="relative flex-1 overflow-hidden">

        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous template"
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${showLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => scrollBy(1)}
          aria-label="Next template"
          className={`absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${showRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <ChevronRight size={18} />
        </button>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "ArrowRight") { e.preventDefault(); focusCard(currentCard); }
            if (e.key === "ArrowLeft")  { e.preventDefault(); focusCard(currentCard - 2); }
          }}
          role="listbox"
          aria-label="Profile README templates"
          aria-orientation="horizontal"
          className="h-full flex gap-5 overflow-x-auto pb-4 gallery-scroll"
          style={{ paddingLeft: 24, paddingRight: 24 }}
        >
          {TEMPLATES.map((t, idx) => {
            const isSelected = picked === t.id;
            const isHovered = hovered === t.id;
            const isNew = NEW_PROFILE_IDS.has(t.id);
            const bestForStr = t.tags.slice(0, 2).join(", ");

            return (
              <div
                key={t.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                role="option"
                tabIndex={0}
                aria-selected={isSelected}
                aria-label={`Template: ${t.name}, best for ${bestForStr}. ${idx + 1} of ${TEMPLATES.length}.`}
                className={`gallery-card relative flex-shrink-0 rounded-[20px] overflow-hidden${cardsReady ? " gallery-card-enter" : ""}`}
                style={{
                  width: CARD_W,
                  height: "calc(85vh - 80px)",
                  background: t.cardBg,
                  cursor: "pointer",
                  boxShadow: isHovered || isSelected
                    ? `0 20px 60px ${t.accentColor}28`
                    : "0 4px 24px rgba(0,0,0,0.4)",
                  transform: isHovered ? "scale(1.02) translateY(-4px)" : "scale(1) translateY(0)",
                  transition: "transform 0.3s cubic-bezier(.03,.98,.52,.99), box-shadow 0.3s ease",
                  border: isSelected ? `2px solid ${t.accentColor}` : "2px solid transparent",
                  animationDelay: `${idx * 65}ms`,
                  ["--focus-ring" as string]: t.accentColor,
                }}
                onMouseEnter={() => setHovered(t.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { setPicked(t.id); setModalTemplate(t); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPicked(t.id);
                    setModalTemplate(t);
                  }
                  if (e.key === "ArrowRight") { e.preventDefault(); focusCard(idx + 1); }
                  if (e.key === "ArrowLeft")  { e.preventDefault(); focusCard(idx - 1); }
                }}
              >
                {/* New badge */}
                {isNew && (
                  <div
                    className="badge-new absolute top-4 left-4 z-20 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{ background: t.accentColor, color: "#fff", letterSpacing: "0.1em" }}
                  >
                    New
                  </div>
                )}

                {/* Selected check */}
                {isSelected && (
                  <div
                    className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: t.accentColor }}
                  >
                    <Check size={14} className="text-white" />
                  </div>
                )}

                {/* Preview area — dark GitHub style */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: "68%",
                    background: t.cardBg,
                    transform: isHovered ? "scale(1.03)" : "scale(1)",
                    transformOrigin: "top center",
                    transition: "transform 0.4s cubic-bezier(.03,.98,.52,.99)",
                  }}
                >
                  <div
                    className="readme-preview-dark absolute inset-0 overflow-hidden p-6"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {t.previewMd}
                    </ReactMarkdown>
                  </div>
                  {/* Bottom fade */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                    style={{ background: `linear-gradient(to top, ${t.cardBg}, transparent)` }}
                  />
                  {/* Accent top strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: t.accentColor, opacity: 0.7 }}
                  />
                </div>

                {/* Info panel — frosted glass */}
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: "34%",
                    background: t.infoBg,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderTop: `1px solid ${t.infoBorder}`,
                    padding: "18px 22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h3 className="text-base font-bold mb-1.5" style={{ color: t.infoText }}>
                      {t.name}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: t.infoSub }}>{t.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {t.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: t.tagBg, color: t.tagText }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div
                    style={{
                      transform: isHovered ? "translateY(0)" : "translateY(6px)",
                      opacity: isHovered ? 1 : 0.5,
                      transition: "transform 0.25s ease, opacity 0.25s ease",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPicked(t.id);
                        setModalTemplate(t);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{ background: t.accentColor, color: "#fff" }}
                    >
                      Customize this <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex-shrink-0 w-6" />
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 py-3 flex-shrink-0" aria-hidden="true">
        {TEMPLATES.map((t, idx) => {
          const isActive = currentCard === idx + 1;
          return (
            <div
              key={t.id}
              className="rounded-full transition-all duration-300"
              style={{
                width: isActive ? 20 : 6,
                height: 6,
                background: isActive ? t.accentColor : "#3f3f46",
              }}
            />
          );
        })}
      </div>

      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Template ${currentCard} of ${TEMPLATES.length}${picked ? `, ${selectedTemplate?.name} selected` : ""}`}
      </div>
    </div>

    {/* ── Preview detail modal ── */}
    {modalTemplate && (
      <TemplatePreviewModal
        isOpen={true}
        onClose={() => setModalTemplate(null)}
        onConfirm={() => onPick(modalTemplate!)}
        name={modalTemplate.name}
        tagline={modalTemplate.description}
        readme={modalTemplate.previewMd}
        previewScheme="dark"
        bestFor={modalTemplate.tags}
        sections={modalTemplate.sections.map((id) => ({
            label: SECTION_META[id]?.label ?? id,
            description: SECTION_META[id]?.description ?? "",
          }))}
        estimatedTime="3–5 minutes"
        confirmLabel="Customize this template"
        loadingMessage={`Setting up ${modalTemplate.name}…`}
        accentColor={modalTemplate.accentColor}
      />
    )}
    </>
  );
}

// ─── Step 2: Builder ──────────────────────────────────────────────────────────

function Builder({
  activeSections, setActiveSections, data, setData, onBack,
}: {
  activeSections: SectionId[];
  setActiveSections: React.Dispatch<React.SetStateAction<SectionId[]>>;
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
  onBack: () => void;
}) {
  const [expanded, setExpanded] = useState<SectionId | null>("intro");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [previewTab, setPreviewTab] = useState<"preview" | "raw">("preview");
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => generateMarkdown(data, activeSections), [data, activeSections]);
  const available = SECTION_ORDER.filter((s) => !activeSections.includes(s));
  const set = (patch: Partial<ProfileData>) => setData((prev) => ({ ...prev, ...patch }));

  const removeSection = (id: SectionId) => {
    if (id === "intro") return;
    setActiveSections((prev) => prev.filter((s) => s !== id));
    if (expanded === id) setExpanded(null);
  };

  const addSection = (id: SectionId) => {
    setActiveSections((prev) =>
      [...prev, id].sort((a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b))
    );
    setExpanded(id);
    setShowAddPanel(false);
  };

  const handleCopy = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Failed to copy"); }
  };

  const handleDownload = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "README.md"; a.click();
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded!");
  };

  return (
    <div className="flex h-[calc(100vh-53px)] overflow-hidden">
      {/* ═══ LEFT: Builder ═══ */}
      <div className="flex flex-col w-full lg:w-[48%] border-r border-gray-200 dark:border-zinc-800/60 bg-white dark:bg-transparent overflow-y-auto">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-zinc-800/60 bg-white/90 dark:bg-[#09090b]/80 backdrop-blur-sm">
          <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors">
            <ChevronLeft size={14} />
            Templates
          </button>
          <span className="text-xs text-gray-500 dark:text-zinc-500">
            Profile <span className="text-blue-500 dark:text-blue-400 font-medium">Builder</span>
          </span>
          <div className="w-20" />
        </div>

        <div className="p-4 space-y-2 pb-6">
          {/* Section blocks */}
          {activeSections.map((id) => {
            const meta = SECTION_META[id];
            const isExpanded = expanded === id;
            const isIntro = id === "intro";

            return (
              <div key={id} className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                {/* Section header */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-zinc-900/60 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-900/80 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : id)}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-gray-400 dark:text-zinc-500">{meta.icon}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-zinc-200">{meta.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!isIntro && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeSection(id); }}
                        className="w-5 h-5 flex items-center justify-center rounded-md text-gray-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        title="Remove section"
                      >
                        <X size={12} />
                      </button>
                    )}
                    {isExpanded
                      ? <ChevronUp size={14} className="text-gray-400 dark:text-zinc-600" />
                      : <ChevronDown size={14} className="text-gray-400 dark:text-zinc-600" />
                    }
                  </div>
                </div>

                {/* Section fields */}
                {isExpanded && (
                  <div className="px-4 py-4 border-t border-gray-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/20">
                    <SectionFields id={id} data={data} set={set} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Add section */}
          <div className="mt-1">
            {!showAddPanel ? (
              <button
                onClick={() => setShowAddPanel(true)}
                disabled={available.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 text-xs text-gray-500 dark:text-zinc-500 hover:border-blue-300 dark:hover:border-blue-500/40 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-600/[0.04] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={13} />
                Add section
              </button>
            ) : (
              <div className="border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-zinc-900/60 border-b border-gray-100 dark:border-zinc-800/60">
                  <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">Add a section</span>
                  <button onClick={() => setShowAddPanel(false)} className="text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors">
                    <X size={13} />
                  </button>
                </div>
                <div className="p-2 space-y-1 bg-white dark:bg-zinc-900/20">
                  {available.map((id) => {
                    const meta = SECTION_META[id];
                    return (
                      <button
                        key={id}
                        onClick={() => addSection(id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-blue-50 dark:hover:bg-blue-600/[0.06] hover:border-blue-200 dark:hover:border-blue-500/20 border border-transparent transition-all"
                      >
                        <span className="text-gray-400 dark:text-zinc-500 flex-shrink-0">{meta.icon}</span>
                        <div>
                          <p className="text-xs font-medium text-gray-800 dark:text-zinc-200">{meta.label}</p>
                          <p className="text-[10px] text-gray-400 dark:text-zinc-600">{meta.description}</p>
                        </div>
                        <Plus size={12} className="ml-auto text-gray-300 dark:text-zinc-700" />
                      </button>
                    );
                  })}
                  {available.length === 0 && (
                    <p className="text-xs text-gray-400 dark:text-zinc-600 text-center py-2">All sections added</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Export buttons */}
          {markdown && (
            <div className="flex gap-2 pt-2">
              <button onClick={handleCopy} className="flex items-center gap-1.5 px-4 py-2 text-xs text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700/60 rounded-lg transition-colors">
                {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy markdown"}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Download size={13} />
                Download .md
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ RIGHT: Live Preview ═══ */}
      <div className="hidden lg:flex flex-col flex-1 bg-gray-50 dark:bg-[#0c0c0e]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/20">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800/80 rounded-lg p-0.5">
            {(["preview", "raw"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPreviewTab(tab)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors capitalize ${
                  previewTab === tab
                    ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300"
                }`}
              >
                {tab === "preview" ? <Eye size={12} /> : <Code size={12} />}
                {tab === "preview" ? "Preview" : "Markdown"}
              </button>
            ))}
          </div>
          {markdown && (
            <div className="flex items-center gap-1.5">
              <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/60 transition-colors">
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <Download size={12} /> .md
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {markdown ? (
            previewTab === "preview" ? (
              <div className="markdown-body animate-[fadeIn_0.3s_ease-out]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
              </div>
            ) : (
              <pre className="text-xs text-gray-600 dark:text-zinc-400 font-mono whitespace-pre-wrap break-words leading-relaxed animate-[fadeIn_0.3s_ease-out]">
                {markdown}
              </pre>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800/50 flex items-center justify-center mb-3">
                <Zap size={20} className="text-gray-400 dark:text-zinc-600" />
              </div>
              <p className="text-sm text-gray-500 dark:text-zinc-600 mb-1">Live preview</p>
              <p className="text-xs text-gray-400 dark:text-zinc-700">Fill in your details to see the README appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function ProfileForm({ onBack }: Props) {
  const [step, setStep] = useState<"pick" | "build">("pick");
  const [activeSections, setActiveSections] = useState<SectionId[]>(["intro"]);
  const [data, setData] = useState<ProfileData>(DEFAULT_DATA);

  const pickTemplate = (t: typeof TEMPLATES[number]) => {
    setActiveSections([...t.sections]);
    setData({ ...DEFAULT_DATA, ...t.sampleData });
    setStep("build");
  };

  if (step === "pick") {
    return <TemplatePicker onPick={pickTemplate} onBack={onBack} />;
  }

  return (
    <Builder
      activeSections={activeSections}
      setActiveSections={setActiveSections}
      data={data}
      setData={setData}
      onBack={() => setStep("pick")}
    />
  );
}
