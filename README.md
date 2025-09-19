# Untangle 🪢

**Demystifying Legal Documents for Everyone**

Legal documents are long, complex, and filled with jargon—making them hard to read, easy to ignore, and risky to sign. **Untangle** is an intelligent solution that simplifies legal text into clear, accessible language, highlights hidden risks, and empowers people to make informed decisions—without always needing a lawyer.

---
![untangle-architecture](https://github.com/user-attachments/assets/44bada45-2154-4d76-b655-8e0a35587c00)


## 🚀 Features

* **Zero-friction access**: Works instantly with overlays, quick toggles, and chat—no tedious uploads or portals.
* **WhatsApp integration**: Get clarity right where you already spend your time.
* **Cross-platform presence**: Mobile overlay, Web dashboard, Chrome Extension, and WhatsApp.
* **Centralised insights**: Keep track of past documents, risks, and summaries instead of one-time outputs.
* **Made for everyone**: Simple language, friendly UX, confidence for all users—students, small businesses, and everyday citizens.

---

## 🏗️ Architecture

Untangle is a **Turborepo monorepo** containing multiple apps and packages:

### **Apps**

* **`apps/web`** → Next.js web dashboard for users.
* **`apps/server`** → Hono + Drizzle backend API (Cloudflare Workers + Turso DB).
* **`browser-extension`** → Chrome extension for on-page legal text analysis.

### **ADK (Agent Development Kit)**

* **`adk/untangle_agent`** → Core AI coordinator + specialized sub-agents:

  * **Demistifier Agent** → Summarises and explains legal documents.
  * **Risk Evaluator + Extractor** → Identifies risky clauses and phrases.
  * **Conversation Agent** → Chat with your stored documents and insights.

### **Shared Packages**

* **`packages/ui`** → Shared React UI components.
* **`packages/eslint-config`** → Shared linting rules.
* **`packages/typescript-config`** → Shared TS configs.

---

## 📂 Directory Structure

```
rookie-house-untangle/
 ├── adk/                   # AI agent pipelines
 ├── apps/                  # Web, server, extension
 ├── packages/              # Shared configs & UI
 ├── .github/workflows/     # CI/CD
 ├── turbo.json             # Turborepo config
 ├── pnpm-workspace.yaml    # Monorepo workspace
 └── package.json
```

---

## ⚡ Getting Started

### Prerequisites

* Node.js **>=18**
* pnpm **>=9**
* Python **>=3.13** (for ADK)
* Turso database & Cloudflare Workers account

### Install dependencies

```sh
pnpm install
```

### Run development servers

```sh
# Start everything
pnpm dev

# Start only web
pnpm turbo dev --filter=web

# Start only server
pnpm turbo dev --filter=server
```

### Build all apps

```sh
pnpm build
```

---

## 🔑 Environment Variables

Create `.env` or `.dev.vars` files in **apps/server/** with:

```env
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
JWT_SECRET=
SALT=
FRONTEND_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
UNTANGLE_ADK_API=
```

---

## 📦 Deployment

* **Frontend (web)** → Vercel
* **Backend (server)** → Cloudflare Workers
* **Database** → Turso (libSQL)
* **AI Agents** → Google ADK + Gemini models

---

## 💡 Why Untangle?

* Makes legal documents **simple, not scary**.
* Highlights **risks hidden in fine print**.
* Works **where you already are** (WhatsApp, browser, mobile).
* Provides **ongoing insights**, not just one-off summaries.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js, Tailwind, Shadcn UI
* **Backend**: Hono, Drizzle ORM, Cloudflare Workers
* **Database**: Turso (libSQL)
* **Agents**: Google ADK, Gemini 2.x models
* **Extension**: Chrome + Vite + React

---

## 👥 Contributing

We welcome contributions from developers, legal professionals, and designers!

* Fork the repo
* Create a feature branch
* Open a PR 🎉

---

## 📜 License

[MIT License.](LICENSE.md)
