# GitHub Profile README Builder

A visual builder for GitHub profile READMEs. Import your real GitHub data, fill in
profile details, pick a template, drag-and-drop to reorder sections, preview live,
and export a polished `README.md`.

## What's included (working, real functionality)

- **GitHub Import** — real calls to the public GitHub REST API (no auth required)
  pulling your profile info and repositories
- **Manual Profile Builder** — name, headline, bio, current work, learning goals,
  collaboration interests, contact info, fun fact
- **Repository Selection** — pick which repos become "Featured Projects" cards
- **Skills Manager** — categorized skill badges (languages, frontend, backend,
  database, cloud/devops, tools) rendered via shields.io
- **Social Links** — 15 platforms, rendered as badges
- **Dynamic Widgets** — GitHub stats, streak, top languages, trophy, profile views,
  activity graph (via github-readme-stats / github-profile-trophy / komarev)
- **Drag-and-drop section reordering** with per-section visibility toggles
- **5 templates** — Minimal, Modern, Professional, Developer, Terminal
- **Live Preview** — renders the generated markdown exactly like GitHub, with
  desktop/tablet/mobile viewport toggle
- **Export** — download `README.md` or copy markdown to clipboard
- **Local persistence** — your work is saved in browser localStorage automatically
  (via Zustand's persist middleware), so refreshing doesn't lose your progress

## What's intentionally NOT included in this build

This is a scoped-down, honest version of a much larger spec. The following are
**not** implemented, and would each be a substantial follow-up phase:

- Database (Postgres/Prisma), user accounts, OAuth login, saved-to-cloud drafts
- Resume (PDF/DOCX) parsing and AI-based content generation
- Banner/badge visual builders (canvas-based image export)
- README analyzer/scoring, markdown validation, accessibility checks
- Monaco code editor, GitHub Actions workflow generator

The "Extending this project" section below explains how each of these would
plug into the existing architecture.

## Prerequisites

- **Node.js 18.18 or later** (Node 20 LTS recommended) — check with `node -v`
- **npm** (comes with Node) — check with `npm -v`

## Setup — run it locally

1. **Get the code onto your machine.** If you're reading this inside Claude's
   sandbox output, download/copy the whole `readme-builder` folder to your
   computer. Otherwise, if this was delivered as a zip or repo, extract/clone it.

2. **Install dependencies:**

   ```bash
   cd readme-builder
   npm install
   ```

   This will download React, Next.js, Zustand, dnd-kit, react-markdown, and all
   other dependencies listed in `package.json`. It requires an internet connection.

3. **(Optional) Add a GitHub token** to raise the API rate limit:

   ```bash
   cp .env.example .env.local
   ```

   Then open `.env.local` and paste a GitHub personal access token (no scopes
   needed — it's only used for reading public data):

   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```

   You can skip this entirely — the app works without a token, just limited to
   60 GitHub API requests per hour per IP (fine for personal use/testing).

4. **Run the dev server:**

   ```bash
   npm run dev
   ```

5. **Open the app:** go to [http://localhost:3000](http://localhost:3000) in
   your browser.

6. Click **"Start Building"**, try importing a real GitHub username (e.g. your
   own, or `torvalds` to test with sample data), fill in the profile fields, and
   watch the live preview update on the right. Click **Download README.md** when
   you're happy with it.

## Building for production

```bash
npm run build
npm run start
```

This produces an optimized production build and serves it on port 3000.

## Project structure

```
readme-builder/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Tailwind + theme CSS variables
│   │   ├── builder/
│   │   │   └── page.tsx          # Main builder UI (two-column layout)
│   │   └── api/
│   │       └── github/[username]/route.ts   # GitHub import API route
│   ├── components/
│   │   ├── ui/                   # Button, Input, Textarea, Card (hand-built)
│   │   └── builder/               # All builder feature components
│   │       ├── github-import.tsx
│   │       ├── profile-form.tsx
│   │       ├── skills-manager.tsx
│   │       ├── socials-manager.tsx
│   │       ├── widgets-picker.tsx
│   │       ├── section-manager.tsx   # drag-and-drop reordering
│   │       ├── template-picker.tsx
│   │       ├── live-preview.tsx
│   │       └── export-panel.tsx
│   ├── lib/
│   │   ├── github.ts              # GitHub API client
│   │   ├── markdown-generator.ts  # State -> README markdown
│   │   └── utils.ts
│   ├── store/
│   │   └── builder-store.ts       # Zustand store (single source of truth)
│   └── types/
│       └── index.ts                # All shared TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── .env.example
```

## How it works (architecture notes)

- **State** lives in one Zustand store (`src/store/builder-store.ts`) and persists
  to `localStorage` automatically. Every component reads/writes through this
  store — there's no prop drilling.
- **Markdown generation is pure and synchronous**: `generateReadme(state)` in
  `src/lib/markdown-generator.ts` takes the entire builder state and returns a
  markdown string. The live preview and export panel both just call this
  function — there's no duplicated logic between "preview" and "export".
- **GitHub import** goes through a Next.js API route (`/api/github/[username]`)
  rather than calling the GitHub API directly from the browser, so a
  `GITHUB_TOKEN` (if you add one) never gets exposed to the client.
- **Widgets and badges** aren't generated locally — they're `<img>` tags
  pointing at existing, well-established public services
  (github-readme-stats.vercel.app, img.shields.io, komarev.com). This keeps the
  app simple and the badges always up to date automatically.

## Extending this project toward the full spec

If you want to grow this into the full-featured product described in the
original spec, here's a sensible order:

1. **Auth + Database** — add NextAuth.js with GitHub OAuth, Prisma + PostgreSQL
   (Neon works well for a free hosted Postgres), and a `Draft` model so users
   can save/load projects instead of relying on localStorage.
2. **Resume parsing** — add an upload endpoint using `pdf-parse` (PDF) and
   `mammoth` (DOCX), extract text, then feed it to an LLM (Anthropic/OpenAI API)
   with a structured-output prompt to map fields onto `ProfileFields`.
3. **AI content generation** — add a `/api/ai/generate-section` route that
   takes existing profile data and a "tone" parameter, calls Claude's API, and
   returns suggested bio/about text the user can accept or edit.
4. **README analyzer** — a scoring function similar to `generateReadme` but in
   reverse: parse an uploaded README, check for sections/images/badges, and
   return a completeness score with suggestions.
5. **Banner/badge visual builders** — these need canvas-based rendering
   (e.g. `fabric.js` or `konva`) since they export PNG images, which is a
   meaningfully different problem from markdown generation.

Each of these plugs into the existing store/lib/component pattern without
requiring a rewrite of what's here.

## Troubleshooting

- **"GitHub API rate limit exceeded"** — add a `GITHUB_TOKEN` to `.env.local`
  (see step 3 above) and restart `npm run dev`.
- **Port 3000 already in use** — run `npm run dev -- -p 3001` and open
  `http://localhost:3001` instead.
- **`npm install` fails** — make sure you're on Node 18.18+ (`node -v`); older
  Node versions aren't supported by Next.js 14.
