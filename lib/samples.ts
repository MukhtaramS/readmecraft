export type TemplateId =
  | "clean-library"
  | "api-docs"
  | "fullstack-app"
  | "showcase"
  | "open-source"
  | "startup";

export interface TemplateSection {
  label: string;
  description: string;
}

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  tagline: string;
  category: string;
  example: string;
  style: "minimal" | "detailed" | "showcase";
  bestFor: string[];
  sections: TemplateSection[];
  estimatedTime: string;
  readme: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "clean-library",
    name: "Clean Library",
    tagline: "Minimal & focused",
    category: "Library / Package",
    example: "lodash · zod · date-fns",
    style: "minimal",
    bestFor: ["NPM / pip packages", "JavaScript libraries", "CLI tools", "Utility modules"],
    estimatedTime: "2–3 minutes",
    sections: [
      { label: "Header & badges", description: "npm version, license, CI status" },
      { label: "Installation", description: "One-liner npm/yarn/pnpm command" },
      { label: "Usage with code", description: "Import example and basic call" },
      { label: "API reference table", description: "Function signatures and descriptions" },
      { label: "License", description: "MIT or chosen license" },
    ],
    readme: `# toolkit

> A lightweight utility library for modern JavaScript projects.

[![npm](https://img.shields.io/npm/v/toolkit)](https://npmjs.com/package/toolkit)
[![license](https://img.shields.io/npm/l/toolkit)](LICENSE)

## Installation

\`\`\`bash
npm install toolkit
\`\`\`

## Usage

\`\`\`ts
import { debounce, throttle } from "toolkit";

const handleResize = debounce(() => console.log("resized"), 300);
\`\`\`

## API

| Function | Description |
|----------|-------------|
| \`debounce(fn, ms)\` | Delays fn until after ms have elapsed |
| \`throttle(fn, ms)\` | Limits fn to once per ms interval |
| \`clamp(n, min, max)\` | Clamps a number between min and max |

## License

MIT`,
  },
  {
    id: "api-docs",
    name: "API Docs",
    tagline: "Clear & comprehensive",
    category: "REST / GraphQL API",
    example: "Express · Fastify · Hono",
    style: "detailed",
    bestFor: ["REST APIs", "GraphQL services", "Backend services", "Microservices"],
    estimatedTime: "3–4 minutes",
    sections: [
      { label: "Overview", description: "What the API does and who it's for" },
      { label: "Prerequisites & install", description: "Node version, dependencies, setup" },
      { label: "Authentication endpoints", description: "Login, register, token refresh" },
      { label: "Resource endpoints", description: "CRUD routes with methods" },
      { label: "Environment variables", description: "Required and optional config table" },
      { label: "Contributing & license", description: "PR process and license info" },
    ],
    readme: `# REST API

A production-ready REST API built with Node.js and Express.

[![Build](https://img.shields.io/github/actions/workflow/status/user/api/ci.yml)](https://github.com/user/api)
[![Coverage](https://img.shields.io/codecov/c/github/user/api)](https://codecov.io/gh/user/api)

## Overview

This API provides endpoints for managing users, resources, and authentication in your application.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

\`\`\`bash
git clone https://github.com/user/api
cd api
npm install
cp .env.example .env
npm run db:migrate
npm run dev
\`\`\`

## API Reference

### Authentication

\`\`\`
POST /auth/login
POST /auth/register
POST /auth/refresh
DELETE /auth/logout
\`\`\`

### Users

\`\`\`
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
\`\`\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`DATABASE_URL\` | PostgreSQL connection string | ✅ |
| \`JWT_SECRET\` | Secret for signing tokens | ✅ |
| \`PORT\` | Server port (default: 3000) | ❌ |

## Contributing

Pull requests are welcome. For major changes, open an issue first.

## License

MIT`,
  },
  {
    id: "fullstack-app",
    name: "Full-Stack App",
    tagline: "Detailed & structured",
    category: "Web Application",
    example: "Next.js · SvelteKit · Remix",
    style: "detailed",
    bestFor: ["Next.js / SvelteKit apps", "SaaS products", "Full-stack projects", "Web applications"],
    estimatedTime: "3–5 minutes",
    sections: [
      { label: "Features list", description: "Emoji-prefixed feature highlights" },
      { label: "Tech stack", description: "Frontend, backend, DB, auth, payments" },
      { label: "Quick start guide", description: "Clone → install → env → run steps" },
      { label: "Project structure", description: "Directory tree with descriptions" },
      { label: "Deployment", description: "One-click Vercel deploy button" },
      { label: "License", description: "MIT license" },
    ],
    readme: `# AppName

A modern full-stack web application built with Next.js, Prisma, and PostgreSQL.

[![Deploy](https://img.shields.io/badge/deployed-vercel-black)](https://appname.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://typescriptlang.org)

## Features

- 🔐 **Authentication** — Email/password + OAuth via NextAuth.js
- 📊 **Dashboard** — Real-time analytics and reporting
- 💳 **Payments** — Stripe integration with webhooks
- 🌍 **i18n** — Multi-language support out of the box

## Tech Stack

**Frontend:** Next.js 14, React, Tailwind CSS, shadcn/ui
**Backend:** Next.js API routes, Prisma ORM
**Database:** PostgreSQL (Neon)
**Auth:** NextAuth.js
**Payments:** Stripe

## Quick Start

\`\`\`bash
git clone https://github.com/user/appname
cd appname
npm install
cp .env.example .env.local
# Fill in your environment variables
npm run db:push
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

\`\`\`
src/
├── app/          # Next.js App Router pages
├── components/   # Reusable UI components
├── lib/          # Utilities and configurations
└── prisma/       # Database schema and migrations
\`\`\`

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/user/appname)

## License

MIT`,
  },
  {
    id: "showcase",
    name: "Showcase",
    tagline: "Visual & eye-catching",
    category: "Portfolio / Demo",
    example: "SaaS · Demos · Side projects",
    style: "showcase",
    bestFor: ["Portfolio demos", "Side projects", "Hackathon projects", "Open betas"],
    estimatedTime: "4–5 minutes",
    sections: [
      { label: "Centered hero", description: "Title, tagline, star/license/demo badges" },
      { label: "Screenshot placeholder", description: "App screenshot or demo GIF" },
      { label: "Key features", description: "4–6 emoji-prefixed feature bullets" },
      { label: "Tech stack badges", description: "Shield.io badges for each tool" },
      { label: "Getting started", description: "npx create command or quick install" },
      { label: "Contributing & stars CTA", description: "Encourage contributions and stars" },
    ],
    readme: `<div align="center">

# ✨ ProjectName

**The fastest way to [do something amazing].**

[![Stars](https://img.shields.io/github/stars/user/project?style=for-the-badge)](https://github.com/user/project/stargazers)
[![License](https://img.shields.io/github/license/user/project?style=for-the-badge)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-blue?style=for-the-badge)](https://project.demo.com)

![App Screenshot](https://via.placeholder.com/900x500/1a1a2e/ffffff?text=App+Screenshot)

</div>

## 🚀 What is this?

ProjectName helps developers **build faster** by automating the repetitive parts of [workflow]. No configuration needed — works out of the box.

## ✨ Key Features

- ⚡ **Blazing Fast** — Processes 10,000 items per second
- 🎨 **Beautiful UI** — Designed with care for every detail
- 🔌 **Extensible** — Plugin system for custom integrations
- 📱 **Responsive** — Works flawlessly on all devices

## 🛠 Built With

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel)

## 📦 Getting Started

\`\`\`bash
npx create-projectname my-app
cd my-app
npm run dev
\`\`\`

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## ⭐ Show your support

Give a ⭐ if this project helped you!

---

<div align="center">Made with ❤️ by <a href="https://github.com/user">@user</a></div>`,
  },
  {
    id: "open-source",
    name: "Open Source",
    tagline: "Community-first",
    category: "OSS Project",
    example: "Tools · Frameworks · CLIs",
    style: "detailed",
    bestFor: ["OSS frameworks", "Developer tools", "Community CLIs", "Plugin systems"],
    estimatedTime: "4–6 minutes",
    sections: [
      { label: "Why / motivation", description: "The problem this project solves" },
      { label: "Installation", description: "npm install -g or brew install" },
      { label: "Usage & CLI flags", description: "Commands with examples" },
      { label: "Configuration file", description: "Config schema with code block" },
      { label: "Roadmap", description: "Checked and unchecked task list" },
      { label: "Contributing guide", description: "Fork → install → test → PR flow" },
      { label: "License", description: "MIT with org copyright" },
    ],
    readme: `# project-name

> One-line description of what this project does.

[![CI](https://github.com/org/project/actions/workflows/ci.yml/badge.svg)](https://github.com/org/project/actions)
[![npm version](https://img.shields.io/npm/v/project-name)](https://npm.im/project-name)
[![contributors](https://img.shields.io/github/contributors/org/project)](https://github.com/org/project/graphs/contributors)

## Why?

Most tools in this space require [pain point]. **project-name** takes a different approach: [unique angle].

## Installation

\`\`\`bash
npm install -g project-name
\`\`\`

## Usage

\`\`\`bash
project-name init
project-name run --watch
project-name build --output dist/
\`\`\`

## Configuration

Create a \`project.config.ts\` in your project root:

\`\`\`ts
export default {
  input: "src/index.ts",
  output: "dist/",
  plugins: [],
};
\`\`\`

## Roadmap

- [x] Core functionality
- [x] Plugin system
- [ ] GUI dashboard
- [ ] Cloud sync

## Contributing

We love contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

\`\`\`bash
git clone https://github.com/org/project
npm install
npm test
\`\`\`

## Contributors

Thanks to all our contributors!

## License

MIT © [Org Name](https://github.com/org)`,
  },
  {
    id: "startup",
    name: "Startup / SaaS",
    tagline: "Bold & persuasive",
    category: "SaaS Product",
    example: "Landing page · Product launch",
    style: "showcase",
    bestFor: ["SaaS products", "Product launches", "Self-hosted tools", "Commercial OSS"],
    estimatedTime: "5–7 minutes",
    sections: [
      { label: "Problem & solution", description: "Hook the reader with the pain point" },
      { label: "Pricing table", description: "Free / Pro / Team tier comparison" },
      { label: "Self-hosting guide", description: "Docker run command with env vars" },
      { label: "Tech stack", description: "Open-source technologies used" },
      { label: "Security & compliance", description: "SOC 2, GDPR, encryption" },
      { label: "Contact & community", description: "Email, Twitter, Discord links" },
    ],
    readme: `<div align="center">
  <img src="logo.png" alt="Logo" width="80" />
  <h1>StartupName</h1>
  <p><strong>Turn [problem] into [outcome] — in minutes, not months.</strong></p>

[![Product Hunt](https://img.shields.io/badge/Product%20Hunt-%231%20of%20the%20Day-orange?style=for-the-badge)](https://producthunt.com)
[![Users](https://img.shields.io/badge/10k%2B-Happy%20Users-green?style=for-the-badge)](#)
[![Uptime](https://img.shields.io/badge/99.9%25-Uptime-blue?style=for-the-badge)](#)

</div>

---

## The Problem

Every developer wastes **hours** on [tedious task]. Existing solutions are either too complex, too expensive, or just broken.

## Our Solution

StartupName is a [category] that [core value prop]. It integrates with your existing workflow in under 5 minutes.

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0/mo | Up to 3 projects |
| Pro | $12/mo | Unlimited + priority support |
| Team | $49/mo | Everything + team features |

## Self-hosting

\`\`\`bash
docker run -p 3000:3000 \\
  -e DATABASE_URL=postgres://... \\
  -e SECRET_KEY=... \\
  ghcr.io/org/startupname
\`\`\`

## Stack

Built on open-source tech: Next.js, PostgreSQL, Redis, and deployed on Fly.io.

## Security

- SOC 2 Type II compliant
- End-to-end encryption
- GDPR ready

## Contact

[hello@startup.com](mailto:hello@startup.com) · [@startup](https://twitter.com/startup) · [Discord](https://discord.gg/startup)`,
  },
];
