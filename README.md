# Prompt Library

A Next.js app to browse, search, copy, and **live-test** production-ready AI prompts. Currently sourced from the [Anthropic Prompt Library](https://docs.anthropic.com/en/prompt-library) — more providers coming soon.

Built by [Pixl](https://pixldev.be).

## Features

- **59 prompts** across 10 categories with instant search and filtering
- **Copy** ready-to-run code — Python (`anthropic` SDK) or TypeScript (`@anthropic-ai/sdk`)
- **Test live** — paste an API key and run any prompt against Anthropic, OpenAI, or Google
- **Dark theme** inspired by [skills.sh](https://skills.sh) / Vercel design language
- **Split data** — each category lives in its own JSON file for readability
- **SEO-ready** — Open Graph, Twitter cards, favicon, web manifest

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
prompt-library/
├── data/                          # prompt data (one JSON per category)
│   ├── categories.json
│   ├── coding.json                  (11 prompts)
│   ├── writing.json                 (11 prompts)
│   ├── creativity.json              (9 prompts)
│   ├── data-and-analysis.json       (7 prompts)
│   ├── business.json                (7 prompts)
│   ├── education.json               (4 prompts)
│   ├── philosophy-and-ethics.json   (4 prompts)
│   ├── lifestyle-and-wellness.json  (4 prompts)
│   ├── language.json                (1 prompt)
│   └── safety.json                  (1 prompt)
├── public/                        # static assets
│   ├── logo.svg                     (Pixl logo — white)
│   ├── logo-color.svg               (Pixl logo — color)
│   ├── favicon.ico
│   └── site.webmanifest
├── src/
│   ├── app/
│   │   ├── layout.tsx             # root layout + SEO metadata
│   │   ├── page.tsx               # home page (server component)
│   │   ├── globals.css            # theme + base styles
│   │   └── api/test/route.ts      # API route for live testing
│   ├── components/
│   │   ├── PromptLibrary.tsx      # main client component (table, search, tabs)
│   │   └── PromptModal.tsx        # detail modal (copy, test, edit input)
│   └── lib/
│       ├── types.ts               # TypeScript interfaces
│       └── prompts.ts             # data loader + provider config
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Data Format

Each prompt JSON object:

```json
{
  "slug": "website_wizard",
  "title": "Website Wizard",
  "description": "Create one-page websites based on user specifications.",
  "category": "coding",
  "categoryLabel": "Coding",
  "categoryIcon": "⌨️",
  "source": "https://docs.anthropic.com/en/prompt-library/website-wizard",
  "hasSystem": true,
  "system": "Your task is to create a one-page website...",
  "userExample": "Create a one-page website for...",
  "inputSchema": {
    "label": "Describe the website you want",
    "type": "textarea",
    "placeholder": "Describe the purpose, sections, features..."
  }
}
```

## Copy Code

The modal generates ready-to-run snippets:

**Python**
```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    system="...",
    messages=[{"role": "user", "content": "..."}],
)
print(message.content[0].text)
```

**TypeScript**
```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: "...",
    messages: [{ role: "user", content: "..." }],
  });
  console.log(message.content[0].text);
}

main();
```

## Live Testing

Click **Test with API Key** in any prompt modal to run it against:

| Provider | Models |
|----------|--------|
| Anthropic | Claude Sonnet 4, Claude Haiku 4 |
| OpenAI | GPT-4o, GPT-4o Mini |
| Google | Gemini 2.0 Flash, Gemini 2.5 Pro |

Your API key is never stored — it lives only in component state and is sent to `/api/test` which proxies the request server-side.

## Tech Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · App Router

## License

MIT

## Author

[Pixl](https://pixldev.be) — hello@pixldev.be
