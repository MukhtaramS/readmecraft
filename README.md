# ReadMeCraft

AI-powered README generator for developers. Fill in your project details, get a professional README in seconds.

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Google Gemini API key](https://aistudio.google.com/apikey)

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/readmecraft.git
cd readmecraft

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Gemini API key

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy to Vercel

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add `GEMINI_API_KEY` to Environment Variables
4. Deploy

## Tech Stack

- **Next.js 14** — App Router, API Routes
- **Google Gemini 2.0 Flash** — AI generation
- **Tailwind CSS** — Styling
- **TypeScript** — Type safety

## License

MIT
