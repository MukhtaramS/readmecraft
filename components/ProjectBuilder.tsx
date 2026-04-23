"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChevronLeft, ChevronDown, ChevronUp, Copy, Download, Check,
  Eye, Code, Plus, X, FileText, AlignLeft, List, Layers,
  Terminal, Table2, FolderOpen, MapPin, Users, Scale, Zap,
} from "lucide-react";
import { toast } from "sonner";
import type { TemplateId } from "@/lib/samples";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionId =
  | "header" | "overview" | "features" | "techstack" | "installation"
  | "usage" | "envvars" | "structure" | "roadmap" | "contributing" | "license";

const SECTION_ORDER: SectionId[] = [
  "header", "overview", "features", "techstack", "installation",
  "usage", "envvars", "structure", "roadmap", "contributing", "license",
];

const SECTION_META: Record<SectionId, { label: string; icon: React.ReactNode; description: string }> = {
  header:       { label: "Header",                icon: <FileText size={14} />,   description: "Project name, tagline & badges" },
  overview:     { label: "Overview",              icon: <AlignLeft size={14} />,  description: "What the project does" },
  features:     { label: "Features",              icon: <List size={14} />,       description: "Key features list" },
  techstack:    { label: "Tech Stack",            icon: <Layers size={14} />,     description: "Technologies used" },
  installation: { label: "Installation",          icon: <Terminal size={14} />,   description: "How to install & run" },
  usage:        { label: "Usage",                 icon: <Code size={14} />,       description: "Code examples" },
  envvars:      { label: "Env Variables",         icon: <Table2 size={14} />,     description: "Config variables table" },
  structure:    { label: "Project Structure",     icon: <FolderOpen size={14} />, description: "Directory tree" },
  roadmap:      { label: "Roadmap",               icon: <MapPin size={14} />,     description: "Planned features checklist" },
  contributing: { label: "Contributing",          icon: <Users size={14} />,      description: "How to contribute" },
  license:      { label: "License",               icon: <Scale size={14} />,      description: "License type & author" },
};

type EnvVar      = { name: string; description: string; required: boolean };
type RoadmapItem = { text: string; done: boolean };

type ProjectData = {
  name: string; tagline: string; demoUrl: string;
  badgeLicense: boolean; badgeVersion: boolean; badgeBuild: boolean; centered: boolean;
  description: string;
  features: string[];
  techStack: string[];
  prerequisites: string; installMethod: string; installCommand: string;
  usageCode: string; usageLang: string;
  envVars: EnvVar[];
  structure: string;
  roadmapItems: RoadmapItem[];
  repoUrl: string;
  licenseType: string; authorName: string;
};

const DEFAULT_DATA: ProjectData = {
  name: "", tagline: "", demoUrl: "",
  badgeLicense: true, badgeVersion: false, badgeBuild: false, centered: false,
  description: "",
  features: ["", "", ""],
  techStack: [],
  prerequisites: "", installMethod: "npm", installCommand: "",
  usageCode: "", usageLang: "bash",
  envVars: [{ name: "", description: "", required: true }],
  structure: "",
  roadmapItems: [{ text: "", done: false }, { text: "", done: false }],
  repoUrl: "",
  licenseType: "MIT", authorName: "",
};

// ─── Template defaults ─────────────────────────────────────────────────────────

function getTemplateDefaults(id: TemplateId): { sections: SectionId[]; defaults: Partial<ProjectData> } {
  switch (id) {
    case "clean-library":
      return {
        sections: ["header", "overview", "installation", "usage", "license"],
        defaults: {
          badgeLicense: true, badgeVersion: true, badgeBuild: true,
          installMethod: "npm", usageLang: "typescript", licenseType: "MIT",
        },
      };
    case "api-docs":
      return {
        sections: ["header", "overview", "installation", "envvars", "contributing", "license"],
        defaults: {
          badgeLicense: true, badgeBuild: true, installMethod: "git",
          envVars: [
            { name: "DATABASE_URL",  description: "Database connection string",   required: true  },
            { name: "JWT_SECRET",    description: "Secret for signing tokens",    required: true  },
            { name: "PORT",          description: "Server port (default: 3000)",  required: false },
          ],
          licenseType: "MIT",
        },
      };
    case "fullstack-app":
      return {
        sections: ["header", "features", "techstack", "installation", "structure", "license"],
        defaults: {
          badgeLicense: true, installMethod: "git",
          features: [
            "🔐 **Authentication** — Secure user auth",
            "📊 **Dashboard** — Real-time analytics",
            "⚡ **Performance** — Optimized for speed",
            "",
          ],
          techStack: ["nextjs", "ts", "tailwind", "postgres"],
          licenseType: "MIT",
        },
      };
    case "showcase":
      return {
        sections: ["header", "overview", "features", "techstack", "installation", "contributing"],
        defaults: {
          centered: true, badgeLicense: true, badgeVersion: true,
          features: [
            "⚡ **Blazing Fast** — Built for performance",
            "🎨 **Beautiful UI** — Designed with care",
            "🔌 **Extensible** — Plugin system included",
            "📱 **Responsive** — Works on all devices",
            "",
          ],
          techStack: ["react", "ts", "tailwind"],
        },
      };
    case "open-source":
      return {
        sections: ["header", "overview", "installation", "usage", "roadmap", "contributing", "license"],
        defaults: {
          badgeLicense: true, badgeBuild: true, installMethod: "npm",
          roadmapItems: [
            { text: "Core functionality", done: true  },
            { text: "Plugin system",      done: true  },
            { text: "CLI dashboard",      done: false },
            { text: "Cloud sync",         done: false },
          ],
          licenseType: "MIT",
        },
      };
    case "startup":
      return {
        sections: ["header", "overview", "features", "techstack", "envvars", "license"],
        defaults: {
          centered: true, badgeLicense: true,
          features: [
            "🚀 **Ship Fast** — Production ready in minutes",
            "💡 **Zero Config** — Sensible defaults built in",
            "📊 **Analytics** — Track what matters",
            "🔐 **Secure** — Enterprise-grade security",
            "",
          ],
          envVars: [
            { name: "DATABASE_URL", description: "Database connection string",  required: true },
            { name: "SECRET_KEY",   description: "Application secret key",     required: true },
          ],
          licenseType: "MIT",
        },
      };
    default:
      return {
        sections: ["header", "overview", "features", "installation", "license"],
        defaults: { badgeLicense: true, licenseType: "MIT" },
      };
  }
}

// ─── Markdown generator ────────────────────────────────────────────────────────

function generateMarkdown(data: ProjectData, sections: SectionId[]): string {
  if (!data.name.trim()) return "";
  const has = (s: SectionId) => sections.includes(s);
  const lines: string[] = [];

  // Header
  const badges: string[] = [];
  if (data.badgeLicense) badges.push(`[![License](https://img.shields.io/badge/license-${encodeURIComponent(data.licenseType || "MIT")}-blue.svg)](LICENSE)`);
  if (data.badgeVersion) badges.push(`[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](#)`);
  if (data.badgeBuild)   badges.push(`[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)`);

  if (data.centered) {
    lines.push('<div align="center">'); lines.push("");
    lines.push(`# ✨ ${data.name}`); lines.push("");
    if (data.tagline) { lines.push(`**${data.tagline}**`); lines.push(""); }
    if (badges.length) { lines.push(badges.join(" ")); lines.push(""); }
    if (data.demoUrl)  { lines.push(`[**→ Live Demo**](${data.demoUrl})`); lines.push(""); }
    lines.push("</div>"); lines.push(""); lines.push("---"); lines.push("");
  } else {
    lines.push(`# ${data.name}`); lines.push("");
    if (data.tagline) { lines.push(`> ${data.tagline}`); lines.push(""); }
    if (badges.length) { lines.push(badges.join(" ")); lines.push(""); }
    if (data.demoUrl)  { lines.push(`[Live Demo](${data.demoUrl}) · [Report Bug](#) · [Request Feature](#)`); lines.push(""); }
  }

  // Overview
  if (has("overview") && data.description.trim()) {
    lines.push("## Overview"); lines.push(""); lines.push(data.description.trim()); lines.push("");
  }

  // Features
  const feats = data.features.filter(f => f.trim());
  if (has("features") && feats.length > 0) {
    lines.push(data.centered ? "## ✨ Features" : "## Features"); lines.push("");
    feats.forEach(f => lines.push(`- ${f}`)); lines.push("");
  }

  // Tech Stack
  if (has("techstack") && data.techStack.length > 0) {
    lines.push("## Tech Stack"); lines.push("");
    lines.push(`[![Skills](https://skillicons.dev/icons?i=${data.techStack.join(",")})](https://skillicons.dev)`); lines.push("");
  }

  // Installation
  if (has("installation")) {
    const prereqs = data.prerequisites.trim();
    const cmd     = data.installCommand.trim();
    if (prereqs || cmd) {
      lines.push("## Installation"); lines.push("");
      if (prereqs) { lines.push("### Prerequisites"); lines.push(""); lines.push(prereqs); lines.push(""); }
      if (cmd)     { lines.push("```bash"); lines.push(cmd); lines.push("```"); lines.push(""); }
    }
  }

  // Usage
  if (has("usage") && data.usageCode.trim()) {
    lines.push("## Usage"); lines.push("");
    lines.push(`\`\`\`${data.usageLang}`); lines.push(data.usageCode.trim()); lines.push("```"); lines.push("");
  }

  // Env vars
  const envs = data.envVars.filter(e => e.name.trim());
  if (has("envvars") && envs.length > 0) {
    lines.push("## Environment Variables"); lines.push("");
    lines.push("Copy `.env.example` to `.env` and configure:"); lines.push("");
    lines.push("| Variable | Description | Required |");
    lines.push("|----------|-------------|----------|");
    envs.forEach(e => lines.push(`| \`${e.name}\` | ${e.description || "—"} | ${e.required ? "✅" : "❌"} |`));
    lines.push("");
  }

  // Structure
  if (has("structure") && data.structure.trim()) {
    lines.push("## Project Structure"); lines.push("");
    lines.push("```"); lines.push(data.structure.trim()); lines.push("```"); lines.push("");
  }

  // Roadmap
  const roads = data.roadmapItems.filter(r => r.text.trim());
  if (has("roadmap") && roads.length > 0) {
    lines.push("## Roadmap"); lines.push("");
    roads.forEach(r => lines.push(`- [${r.done ? "x" : " "}] ${r.text}`)); lines.push("");
  }

  // Contributing
  if (has("contributing")) {
    lines.push("## Contributing"); lines.push("");
    lines.push("Contributions are welcome! Please feel free to submit a Pull Request.");
    if (data.repoUrl.trim()) {
      lines.push(""); lines.push("```bash");
      lines.push(`git clone ${data.repoUrl.trim()}`);
      lines.push("npm install"); lines.push("# Make your changes and open a PR!"); lines.push("```");
    }
    lines.push("");
  }

  // License
  if (has("license")) {
    lines.push("## License"); lines.push("");
    lines.push(`Distributed under the ${data.licenseType || "MIT"} License. See [LICENSE](LICENSE) for more information.`);
    if (data.authorName.trim()) { lines.push(""); lines.push(`© ${new Date().getFullYear()} ${data.authorName.trim()}`); }
    lines.push("");
  }

  return lines.join("\n").trim();
}

// ─── Skill categories ──────────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  { label: "Languages", skills: [
    { id: "js", name: "JavaScript" }, { id: "ts", name: "TypeScript" },
    { id: "py", name: "Python" },     { id: "go", name: "Go" },
    { id: "rust", name: "Rust" },     { id: "java", name: "Java" },
    { id: "cpp", name: "C++" },       { id: "cs", name: "C#" },
    { id: "swift", name: "Swift" },   { id: "kotlin", name: "Kotlin" },
    { id: "php", name: "PHP" },       { id: "rb", name: "Ruby" },
  ]},
  { label: "Frontend", skills: [
    { id: "react", name: "React" },     { id: "nextjs", name: "Next.js" },
    { id: "vue", name: "Vue" },         { id: "svelte", name: "Svelte" },
    { id: "angular", name: "Angular" }, { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },         { id: "tailwind", name: "Tailwind" },
    { id: "vite", name: "Vite" },
  ]},
  { label: "Backend", skills: [
    { id: "nodejs", name: "Node.js" },   { id: "express", name: "Express" },
    { id: "nestjs", name: "NestJS" },    { id: "fastapi", name: "FastAPI" },
    { id: "django", name: "Django" },    { id: "flask", name: "Flask" },
    { id: "spring", name: "Spring" },    { id: "bun", name: "Bun" },
  ]},
  { label: "Database", skills: [
    { id: "postgres", name: "PostgreSQL" }, { id: "mysql", name: "MySQL" },
    { id: "mongo", name: "MongoDB" },       { id: "redis", name: "Redis" },
    { id: "sqlite", name: "SQLite" },       { id: "firebase", name: "Firebase" },
    { id: "supabase", name: "Supabase" },   { id: "prisma", name: "Prisma" },
  ]},
  { label: "DevOps & Cloud", skills: [
    { id: "docker", name: "Docker" },           { id: "kubernetes", name: "Kubernetes" },
    { id: "aws", name: "AWS" },                 { id: "gcp", name: "GCP" },
    { id: "vercel", name: "Vercel" },           { id: "netlify", name: "Netlify" },
    { id: "githubactions", name: "GH Actions" }, { id: "linux", name: "Linux" },
  ]},
  { label: "Tools", skills: [
    { id: "git", name: "Git" },         { id: "github", name: "GitHub" },
    { id: "figma", name: "Figma" },     { id: "graphql", name: "GraphQL" },
    { id: "jest", name: "Jest" },       { id: "postman", name: "Postman" },
  ]},
];

// ─── Small UI components ───────────────────────────────────────────────────────

function Field({ label, placeholder, value, onChange, hint, type = "text" }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; hint?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 dark:text-zinc-400 mb-1">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-colors shadow-sm"
      />
      {hint && <p className="mt-1 text-[10px] text-gray-400 dark:text-zinc-600">{hint}</p>}
    </div>
  );
}

function TextArea({ label, placeholder, value, onChange, rows = 3, hint, mono = false }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; rows?: number; hint?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 dark:text-zinc-400 mb-1">{label}</label>
      <textarea
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className={`w-full px-3 py-2 bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 resize-none transition-colors shadow-sm ${mono ? "font-mono text-xs" : ""}`}
      />
      {hint && <p className="mt-1 text-[10px] text-gray-400 dark:text-zinc-600">{hint}</p>}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none" onClick={onChange}>
      <div className={`relative w-8 h-4 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-blue-500" : "bg-gray-200 dark:bg-zinc-700"}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      <span className="text-xs text-gray-600 dark:text-zinc-400">{label}</span>
    </label>
  );
}

function SkillChip({ id, name, selected, onToggle }: { id: string; name: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle} title={name}
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

function MethodButton({ method, active, onClick }: { method: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-[11px] border transition-all ${
        active
          ? "border-blue-400 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400"
          : "border-gray-200 dark:border-zinc-700/40 text-gray-500 dark:text-zinc-500 hover:border-gray-300 dark:hover:border-zinc-600"
      }`}
    >{method}</button>
  );
}

// ─── Section field content ─────────────────────────────────────────────────────

function SectionContent({ id, data, set }: { id: SectionId; data: ProjectData; set: (p: Partial<ProjectData>) => void }) {

  if (id === "header") return (
    <div className="space-y-3">
      <Field label="Project name *" placeholder="my-awesome-project" value={data.name} onChange={v => set({ name: v })} />
      <Field label="Tagline" placeholder="A fast, lightweight tool for building modern apps." value={data.tagline} onChange={v => set({ tagline: v })} />
      <Field label="Live demo / website URL" placeholder="https://myproject.dev" value={data.demoUrl} onChange={v => set({ demoUrl: v })} />
      <div>
        <p className="text-[11px] font-medium text-gray-500 dark:text-zinc-400 mb-2">Badges</p>
        <div className="space-y-1.5">
          <Toggle label="License badge" checked={data.badgeLicense} onChange={() => set({ badgeLicense: !data.badgeLicense })} />
          <Toggle label="Version badge" checked={data.badgeVersion} onChange={() => set({ badgeVersion: !data.badgeVersion })} />
          <Toggle label="Build status badge" checked={data.badgeBuild} onChange={() => set({ badgeBuild: !data.badgeBuild })} />
        </div>
      </div>
      <Toggle label="Centered header (showcase style)" checked={data.centered} onChange={() => set({ centered: !data.centered })} />
    </div>
  );

  if (id === "overview") return (
    <TextArea
      label="Description"
      placeholder="Describe what your project does, the problem it solves, and who it's for."
      value={data.description} onChange={v => set({ description: v })} rows={4}
    />
  );

  if (id === "features") return (
    <div className="space-y-2">
      <p className="text-[10px] text-gray-400 dark:text-zinc-600 mb-1">One feature per line. Tip: use emoji + <strong>bold</strong> for impact.</p>
      {data.features.map((f, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text" value={f}
            onChange={e => { const next = [...data.features]; next[i] = e.target.value; set({ features: next }); }}
            placeholder={i === 0 ? "⚡ **Fast** — Processes data in milliseconds" : i === 1 ? "🔐 **Secure** — End-to-end encryption" : "Add a feature..."}
            className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-colors shadow-sm"
          />
          {data.features.length > 1 && (
            <button onClick={() => set({ features: data.features.filter((_, j) => j !== i) })}
              className="w-6 h-6 flex items-center justify-center text-gray-400 dark:text-zinc-600 hover:text-red-500 transition-colors flex-shrink-0">
              <X size={13} />
            </button>
          )}
        </div>
      ))}
      <button onClick={() => set({ features: [...data.features, ""] })}
        className="flex items-center gap-1.5 text-[11px] text-blue-500 hover:text-blue-600 transition-colors mt-1">
        <Plus size={12} /> Add feature
      </button>
    </div>
  );

  if (id === "techstack") return (
    <div className="space-y-3">
      {data.techStack.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800/40 rounded-lg border border-gray-100 dark:border-zinc-700/30">
          <span className="text-[10px] text-gray-500 dark:text-zinc-500">{data.techStack.length} selected</span>
          <button onClick={() => set({ techStack: [] })} className="text-[10px] text-gray-400 hover:text-gray-600 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Clear all</button>
        </div>
      )}
      {SKILL_CATEGORIES.map(cat => (
        <div key={cat.label}>
          <p className="text-[10px] font-medium text-gray-400 dark:text-zinc-600 uppercase tracking-wide mb-1.5">{cat.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {cat.skills.map(skill => (
              <SkillChip key={skill.id} id={skill.id} name={skill.name}
                selected={data.techStack.includes(skill.id)}
                onToggle={() => set({
                  techStack: data.techStack.includes(skill.id)
                    ? data.techStack.filter(s => s !== skill.id)
                    : [...data.techStack, skill.id],
                })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (id === "installation") {
    const cmdTemplates: Record<string, string> = {
      npm:    `npm install ${data.name || "your-package"}`,
      yarn:   `yarn add ${data.name || "your-package"}`,
      pnpm:   `pnpm add ${data.name || "your-package"}`,
      pip:    `pip install ${data.name || "your-package"}`,
      brew:   `brew install ${data.name || "your-package"}`,
      docker: `docker pull ${data.name || "your-image"}`,
      git:    `git clone https://github.com/user/${data.name || "your-repo"}\ncd ${data.name || "your-repo"}\nnpm install`,
      custom: "",
    };
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-medium text-gray-500 dark:text-zinc-400 mb-1.5">Install method</label>
          <div className="flex flex-wrap gap-1.5">
            {["npm", "yarn", "pnpm", "pip", "brew", "docker", "git", "custom"].map(m => (
              <MethodButton key={m} method={m} active={data.installMethod === m}
                onClick={() => set({ installMethod: m, installCommand: cmdTemplates[m] })} />
            ))}
          </div>
        </div>
        <TextArea
          label="Install command"
          placeholder={cmdTemplates[data.installMethod] || "Enter your install command..."}
          value={data.installCommand} onChange={v => set({ installCommand: v })}
          rows={3} mono
        />
        <TextArea label="Prerequisites (optional)" placeholder={"- Node.js 18+\n- PostgreSQL 14+"} value={data.prerequisites} onChange={v => set({ prerequisites: v })} rows={2} />
      </div>
    );
  }

  if (id === "usage") return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-medium text-gray-500 dark:text-zinc-400 mb-1.5">Language</label>
        <div className="flex flex-wrap gap-1.5">
          {["bash", "typescript", "javascript", "python", "go", "rust", "java"].map(lang => (
            <MethodButton key={lang} method={lang} active={data.usageLang === lang} onClick={() => set({ usageLang: lang })} />
          ))}
        </div>
      </div>
      <TextArea
        label="Usage example"
        placeholder={"import { myFunction } from 'my-package';\n\nmyFunction();"}
        value={data.usageCode} onChange={v => set({ usageCode: v })}
        rows={5} mono
      />
    </div>
  );

  if (id === "envvars") return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-1.5 text-[10px] font-medium text-gray-400 dark:text-zinc-600 px-1">
        <span>Variable</span><span>Description</span><span className="text-center">Req.</span><span />
      </div>
      {data.envVars.map((e, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-1.5 items-center">
          <input type="text" value={e.name} placeholder="DATABASE_URL"
            onChange={ev => { const next = [...data.envVars]; next[i] = { ...e, name: ev.target.value }; set({ envVars: next }); }}
            className="px-2 py-1.5 bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 font-mono"
          />
          <input type="text" value={e.description} placeholder="Connection string"
            onChange={ev => { const next = [...data.envVars]; next[i] = { ...e, description: ev.target.value }; set({ envVars: next }); }}
            className="px-2 py-1.5 bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600"
          />
          <input type="checkbox" checked={e.required}
            onChange={() => { const next = [...data.envVars]; next[i] = { ...e, required: !e.required }; set({ envVars: next }); }}
            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 accent-blue-500 mx-auto"
          />
          <button onClick={() => set({ envVars: data.envVars.filter((_, j) => j !== i) })}
            className="w-5 h-5 flex items-center justify-center text-gray-400 dark:text-zinc-600 hover:text-red-500 transition-colors">
            <X size={12} />
          </button>
        </div>
      ))}
      <button onClick={() => set({ envVars: [...data.envVars, { name: "", description: "", required: false }] })}
        className="flex items-center gap-1.5 text-[11px] text-blue-500 hover:text-blue-600 transition-colors mt-1">
        <Plus size={12} /> Add variable
      </button>
    </div>
  );

  if (id === "structure") return (
    <TextArea
      label="Directory tree" mono rows={6}
      placeholder={"src/\n├── app/          # App pages\n├── components/   # UI components\n└── lib/          # Utilities"}
      value={data.structure} onChange={v => set({ structure: v })}
      hint="Paste or type your project structure"
    />
  );

  if (id === "roadmap") return (
    <div className="space-y-2">
      {data.roadmapItems.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="checkbox" checked={r.done}
            onChange={() => { const next = [...data.roadmapItems]; next[i] = { ...r, done: !r.done }; set({ roadmapItems: next }); }}
            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-zinc-600 accent-blue-500 flex-shrink-0"
          />
          <input type="text" value={r.text}
            onChange={ev => { const next = [...data.roadmapItems]; next[i] = { ...r, text: ev.target.value }; set({ roadmapItems: next }); }}
            placeholder={i === 0 ? "Initial release" : "Planned feature or improvement..."}
            className={`flex-1 px-3 py-1.5 bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 rounded-lg text-sm placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-colors shadow-sm ${r.done ? "line-through text-gray-400 dark:text-zinc-600" : "text-gray-900 dark:text-white"}`}
          />
          <button onClick={() => set({ roadmapItems: data.roadmapItems.filter((_, j) => j !== i) })}
            className="w-5 h-5 flex items-center justify-center text-gray-400 dark:text-zinc-600 hover:text-red-500 transition-colors flex-shrink-0">
            <X size={12} />
          </button>
        </div>
      ))}
      <button onClick={() => set({ roadmapItems: [...data.roadmapItems, { text: "", done: false }] })}
        className="flex items-center gap-1.5 text-[11px] text-blue-500 hover:text-blue-600 transition-colors">
        <Plus size={12} /> Add item
      </button>
    </div>
  );

  if (id === "contributing") return (
    <Field
      label="Repository URL (optional)" type="url"
      placeholder="https://github.com/username/repo"
      value={data.repoUrl} onChange={v => set({ repoUrl: v })}
      hint="Used to generate the git clone command"
    />
  );

  if (id === "license") return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-medium text-gray-500 dark:text-zinc-400 mb-1.5">License type</label>
        <div className="flex flex-wrap gap-1.5">
          {["MIT", "Apache 2.0", "GPL 3.0", "BSD 2-Clause", "BSD 3-Clause", "MPL 2.0", "AGPL 3.0", "Unlicense"].map(l => (
            <MethodButton key={l} method={l} active={data.licenseType === l} onClick={() => set({ licenseType: l })} />
          ))}
        </div>
      </div>
      <Field label="Author / organization" placeholder="Your Name or OrgName" value={data.authorName} onChange={v => set({ authorName: v })} />
    </div>
  );

  return null;
}

// ─── Main component ────────────────────────────────────────────────────────────

type Props = { templateId?: TemplateId; onBack: () => void };

export default function ProjectBuilder({ templateId, onBack }: Props) {
  const { sections: initSections, defaults } = getTemplateDefaults(templateId ?? "clean-library");

  const [sections, setSections]     = useState<SectionId[]>(initSections);
  const [data, setData]             = useState<ProjectData>({ ...DEFAULT_DATA, ...defaults });
  const [expanded, setExpanded]     = useState<SectionId | null>("header");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [previewTab, setPreviewTab] = useState<"preview" | "raw">("preview");
  const [copied, setCopied]         = useState(false);

  const markdown  = useMemo(() => generateMarkdown(data, sections), [data, sections]);
  const available = SECTION_ORDER.filter(s => !sections.includes(s));
  const set = (patch: Partial<ProjectData>) => setData(prev => ({ ...prev, ...patch }));

  const removeSection = (id: SectionId) => {
    if (id === "header") return;
    setSections(prev => prev.filter(s => s !== id));
    if (expanded === id) setExpanded(null);
  };

  const addSection = (id: SectionId) => {
    setSections(prev => [...prev, id].sort((a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b)));
    setExpanded(id);
    setShowAddPanel(false);
  };

  const handleCopy = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Failed to copy"); }
  };

  const handleDownload = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "README.md"; a.click();
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded!");
  };

  return (
    <div className="flex h-[calc(100vh-53px)] overflow-hidden">

      {/* ═══ LEFT: Builder panel ═══ */}
      <div className="flex flex-col w-full lg:w-[48%] border-r border-gray-200 dark:border-zinc-800/60 bg-white dark:bg-transparent overflow-y-auto">

        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-zinc-800/60 bg-white/90 dark:bg-[#09090b]/80 backdrop-blur-sm">
          <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors">
            <ChevronLeft size={14} /> Templates
          </button>
          <span className="text-xs text-gray-500 dark:text-zinc-500">
            README <span className="text-blue-500 dark:text-blue-400 font-medium">Builder</span>
          </span>
          <div className="w-20" />
        </div>

        <div className="p-4 space-y-2 pb-6">

          {/* Section accordion */}
          {sections.map(id => {
            const meta       = SECTION_META[id];
            const isExpanded = expanded === id;
            const isHeader   = id === "header";

            return (
              <div key={id} className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                {/* Section header row */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-zinc-900/60 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-900/80 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : id)}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-gray-400 dark:text-zinc-500">{meta.icon}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-zinc-200">{meta.label}</span>
                    {isHeader && data.name && (
                      <span className="text-xs text-gray-400 dark:text-zinc-600 truncate max-w-[120px]">{data.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!isHeader && (
                      <button
                        onClick={e => { e.stopPropagation(); removeSection(id); }}
                        className="w-5 h-5 flex items-center justify-center rounded-md text-gray-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        title="Remove section"
                      ><X size={12} /></button>
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
                    <SectionContent id={id} data={data} set={set} />
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
                <Plus size={13} /> Add section
              </button>
            ) : (
              <div className="border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-zinc-900/60 border-b border-gray-100 dark:border-zinc-800/60">
                  <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">Add a section</span>
                  <button onClick={() => setShowAddPanel(false)} className="text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors"><X size={13} /></button>
                </div>
                <div className="p-2 space-y-1 bg-white dark:bg-zinc-900/20">
                  {available.map(id => {
                    const meta = SECTION_META[id];
                    return (
                      <button key={id} onClick={() => addSection(id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-blue-50 dark:hover:bg-blue-600/[0.06] border border-transparent transition-all">
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
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 text-xs text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700/60 rounded-lg transition-colors">
                {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy markdown"}
              </button>
              <button onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Download size={13} /> Download .md
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ RIGHT: Live preview ═══ */}
      <div className="hidden lg:flex flex-col flex-1 bg-gray-50 dark:bg-[#0c0c0e]">
        {/* Preview toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/20">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800/80 rounded-lg p-0.5">
            {(["preview", "raw"] as const).map(tab => (
              <button key={tab} onClick={() => setPreviewTab(tab)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  previewTab === tab
                    ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300"
                }`}>
                {tab === "preview" ? <Eye size={12} /> : <Code size={12} />}
                {tab === "preview" ? "Preview" : "Markdown"}
              </button>
            ))}
          </div>
          {markdown && (
            <div className="flex items-center gap-1.5">
              <button onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/60 transition-colors">
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
              <button onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <Download size={12} /> .md
              </button>
            </div>
          )}
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-y-auto p-6">
          {markdown ? (
            previewTab === "preview" ? (
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
              </div>
            ) : (
              <pre className="text-xs text-gray-600 dark:text-zinc-400 font-mono whitespace-pre-wrap break-words leading-relaxed">
                {markdown}
              </pre>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800/50 flex items-center justify-center mb-3">
                <Zap size={20} className="text-gray-400 dark:text-zinc-600" />
              </div>
              <p className="text-sm text-gray-500 dark:text-zinc-600 mb-1">Live preview</p>
              <p className="text-xs text-gray-400 dark:text-zinc-700">Enter your project name to see the README appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
