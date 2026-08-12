# Central Vercel Master API Gateway

> **Account**: abysyweb@gmail.com  
> **Master API Key**: `vcl_master_key_abysyweb_2026`  

A unified, serverless API Gateway designed to serve all web applications and microservices deployed under your Vercel account.

---

## 🚀 Features

- **Universal CORS Support**: Pre-configured headers for seamless cross-origin requests from all `*.vercel.app` frontends.
- **API Key Security Middleware**: Standardized `x-api-key` validation to ensure only authorized projects can consume your backend services.
- **Integrated Service Endpoints**:
  - `GET /api/health` — Service telemetry, uptime, and status.
  - `POST /api/ai/generate` — Unified AI Gateway for Gemini / OpenAI proxying without exposing API keys to client-side JS.
  - `POST /api/mail/send` — Transactional email sending proxy (Resend / SendGrid / Nodemailer).
  - `GET|POST /api/utils/:action` — Core helpers (UUID generation, IP lookup, slugifier, text formatting).
- **Interactive Explorer Dashboard**: Visual UI at `/` for live testing and code snippet generation.

---

## ⚡ Deployment to Vercel

### Option 1: Vercel CLI (Recommended)
1. Open terminal in this folder:
   ```bash
   cd C:\Users\ASUS\.gemini\antigravity\scratch\central-vercel-api
   ```
2. Login & Deploy:
   ```bash
   npx vercel login
   npx vercel --prod
   ```

### Option 2: GitHub Repository Connection
1. Push this folder to a new GitHub repository (e.g. `central-vercel-api`).
2. Log in to [vercel.com](https://vercel.com) using `abysyweb@gmail.com`.
3. Click **Add New Project** -> Select the repository -> Deploy!

---

## 🔑 Environment Variables (Set in Vercel Dashboard)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `MASTER_API_KEY` | Key used in `x-api-key` header | `vcl_master_key_abysyweb_2026` |
| `GEMINI_API_KEY` | Google Gemini API key for AI Gateway | *(Optional)* |
| `RESEND_API_KEY` | Transactional email provider key | *(Optional)* |
| `DATABASE_URL` | PostgreSQL / Neon / Supabase connection | *(Optional)* |

---

## 💻 How to Connect Any Vercel Project

Add this reusable helper to any frontend project (React, Next.js, Vue, Vanilla JS):

```javascript
const CENTRAL_API_URL = "https://your-central-api.vercel.app";
const MASTER_KEY = "vcl_master_key_abysyweb_2026";

export async function callCentralApi(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MASTER_KEY
    }
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${CENTRAL_API_URL}${endpoint}`, options);
  return await res.json();
}
```
