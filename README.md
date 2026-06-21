# Lex AI — EU AI Act Compliance Search

A RAG-powered search tool for **Regulation (EU) 2024/1689** (the EU Artificial Intelligence Act). Ask questions in plain English and receive cited, article-level answers drawn exclusively from the Act's 126 provisions.

![Stack](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![Stack](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Stack](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Stack](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## How it works

1. The user submits a question in plain English.
2. A Vercel serverless function generates a query embedding via **OpenAI** (`text-embedding-3-small`).
3. The embedding is matched against 126 EU AI Act provisions stored in **Supabase** with `pgvector` using the `match_eu_ai_act` RPC function.
4. Matching articles are streamed back to the UI one at a time via **Server-Sent Events (SSE)**.
5. The retrieved articles are sent to **Claude** (`claude-sonnet-4-6`) which synthesises a cited answer, streaming tokens in real time.
6. The final answer renders with inline `[1]` `[2]` citation markers linked to expandable source cards.

Answers are sourced **exclusively** from Regulation (EU) 2024/1689. No other regulations or legal frameworks (GDPR, NIS2, DORA, etc.) are referenced.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS |
| Backend | Vercel Serverless Functions (Node.js) |
| Vector search | Supabase + pgvector (`text-embedding-3-small`, 1536 dims) |
| LLM synthesis | Anthropic Claude (`claude-sonnet-4-6`) |
| Embeddings | OpenAI (`text-embedding-3-small`) |
| Fonts | IBM Plex Serif · IBM Plex Sans · IBM Plex Mono |

---

## Project structure

```
├── api/
│   └── search.ts           # SSE streaming endpoint — embedding → search → synthesis
├── src/
│   ├── components/
│   │   ├── answer/         # AnswerPanel, AnswerText, SourcesList, SourceItem
│   │   ├── layout/         # AppShell, Header
│   │   ├── search/         # SearchInput, RetrievalTrace, TraceStep, ArticleHit
│   │   └── ui/             # Badge, Button
│   ├── constants/          # Design tokens, risk tier styles, trace stage labels
│   ├── hooks/
│   │   └── useSearch.ts    # SSE streaming hook with useReducer state
│   ├── lib/
│   │   ├── api.ts          # Async generator that consumes the SSE stream
│   │   └── utils.ts        # cn(), formatScore helpers
│   ├── pages/
│   │   └── SearchPage.tsx
│   └── types/              # TypeScript interfaces for all data shapes
├── .env.example
├── vercel.json
└── index.html
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Vercel](https://vercel.com) account and the [Vercel CLI](https://vercel.com/docs/cli)
- An [OpenAI](https://platform.openai.com) API key
- An [Anthropic](https://console.anthropic.com) API key
- A Supabase project with the `eu_ai_act_articles` table and `match_eu_ai_act` RPC function

### 1. Clone and install

```bash
git clone https://github.com/sachin-sharma01/eu-ai-act-ui.git
cd eu-ai-act-ui
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your keys:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

### 3. Run locally

```bash
vercel dev
```

This starts both the Vite frontend and the serverless API function on `http://localhost:3000`.

> **Note:** Use `vercel dev` rather than `npm run dev` — the plain Vite dev server cannot serve the `api/` function.

---

## Deploying to Vercel

### Option A — Vercel dashboard (recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
2. Vercel auto-detects Vite — no build configuration needed.
3. Add the four environment variables under **Settings → Environment Variables**:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Deploy.

### Option B — CLI

```bash
vercel deploy --prod
```

Set the environment variables via the dashboard or with:

```bash
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

---

## Supabase schema reference

The app reads from a table `eu_ai_act_articles` with these columns:

| Column | Type | Notes |
|---|---|---|
| `article_number` | text | e.g. `"Article 9"`, `"Annex III"` |
| `title` | text | |
| `chapter`, `section` | text | |
| `original_text` | text | Full legal text |
| `risk_tier` | text | `unacceptable \| high \| limited \| minimal \| not_applicable` |
| `obligation_type` | text | `prohibited \| high_risk \| transparency \| gpai \| governance \| general` |
| `applies_to` | text | `provider \| deployer \| both \| member_state \| all` |
| `banking_relevance` | text | `high \| medium \| low \| not_applicable` |
| `page_reference` | text | e.g. `"pp. 44–45"` |
| `embedding` | vector(1536) | OpenAI `text-embedding-3-small` |

Vector search is performed via the `match_eu_ai_act(query_embedding, match_threshold, match_count, filter_risk_tier, filter_banking)` RPC function.

---

## Environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI key for generating query embeddings |
| `ANTHROPIC_API_KEY` | Anthropic key for answer synthesis via Claude |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key |
