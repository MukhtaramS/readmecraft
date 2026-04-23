# ReadMeCraft — CLAUDE.md

## What this project does

AI-powered README generator. Users describe their project in natural language, pick a style, and get a complete README generated via Google Gemini. They can then refine it through a chat interface.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3, Geist font (sans + mono) |
| AI | Google Gemini (`gemini-2.0-flash`) via `@google/generative-ai` |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-raw` |
| Icons | `lucide-react` |
| Toasts | `sonner` |

---

## Folder Structure

```
readmegenerator/
├── app/
│   ├── layout.tsx          # Root layout — Geist fonts, Sonner toaster, metadata
│   ├── page.tsx            # Entry point — manages the 3-step flow (welcome → style → chat)
│   ├── globals.css         # Global styles, markdown-body prose styles, animations
│   └── api/
│       └── generate/
│           └── route.ts    # POST handler — routes to generate or refine based on payload
├── components/
│   ├── Header.tsx          # Top nav; logo click resets to welcome step
│   ├── WelcomeStep.tsx     # Landing/intro screen
│   ├── StyleStep.tsx       # Style picker: minimal | detailed | showcase
│   └── ChatInterface.tsx   # Main UI: split-pane chat + live preview, copy/download
└── lib/
    └── gemini.ts           # Gemini client, ReadmeStyle type, prompt builders
```

---

## Key Patterns

### Step flow (app/page.tsx)
Three-step wizard managed with a single `step: "welcome" | "style" | "chat"` state. `style: ReadmeStyle` is lifted to the root and passed down.

### Generate vs. Refine (api/generate/route.ts)
The API route checks for `currentReadme` in the request body:
- No `currentReadme` → calls `buildGeneratePrompt` (first generation)
- Has `currentReadme` → calls `buildRefinePrompt` (subsequent refinements)

### Prompt system (lib/gemini.ts)
`STYLE_SYSTEM` is a `Record<ReadmeStyle, string>` holding per-style system instructions. Both prompt builders prepend the relevant style system prompt before the user content. `buildRefinePrompt` also injects the last 6 chat messages as context.

### Component props pattern
Components receive only what they need: `onBack`, `onSelect`, `style`. No global state or context — everything threads through props from `page.tsx`.

### ChatInterface state
All chat state is local to `ChatInterface`: `messages`, `readme`, `input`, `isLoading`, `previewTab`, `showPreview`. The component is fully self-contained once `style` and `onBack` are passed in.

### Tailwind dark theme
Base background is `bg-[#09090b]` (near-black zinc). UI uses `zinc-*` scale throughout. Blue accent is `blue-600`. No light mode.

---

## Environment

Copy `.env.local.example` to `.env.local` and add your key:

```
GEMINI_API_KEY=your_key_here
```

---

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint via next lint
```

No test suite is configured.
