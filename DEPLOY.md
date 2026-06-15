# Deploy to Vercel

## One-command deploy (recommended)

```bash
cd ~/Projects/pm-discovery-guide/app
npm run deploy
```

This builds Next.js locally, then uploads the prebuilt output. Takes ~30s instead of hanging on Vercel's servers.

## If you see 404 or the site won't load

### 1. Turn off Deployment Protection (most common)

Your project currently returns **401** to public visitors because Vercel Authentication is enabled.

1. Open [Vercel Dashboard](https://vercel.com/ritz50s-projects/pm-discovery/settings/deployment-protection)
2. Go to **Settings → Deployment Protection**
3. Set **Production** to **None** (or add yourself as an allowed user)
4. Save and redeploy

### 2. Use the production URL

After deploy, open:

**https://pm-discovery-ritz50s-projects.vercel.app**

Not the long deployment-specific URL (`pm-discovery-xxxxx-...`).

### 3. Push latest code to GitHub (for Git-based deploys)

Vercel builds from GitHub. If you only deploy locally, still push so Git deploys stay in sync:

```bash
cd ~/Projects/pm-discovery-guide
git add .
git commit -m "Fix Vercel Next.js deployment"
git push origin main
```

In **Project Settings → General → Root Directory**, set to **`app`** (optional if using root `vercel.json`).

## Password protection (private beta)

Same pattern as [outreach-voice](~/Projects/outreach-voice). Set in **Vercel → Settings → Environment Variables** (Production only):

```
SITE_ACCESS_PASSWORD=your-shared-password
AUTH_SECRET=random-32-char-string
```

Generate `AUTH_SECRET` with: `openssl rand -hex 32`

- **`/`** stays public (LinkedIn landing page)
- **`/login`** + password unlocks the app at **`/home`**
- Omit both vars locally → `npm run dev` works without login
- Share `SITE_ACCESS_PASSWORD` only via DM — never on LinkedIn

Remove unused **`OPENAI_API_KEY`** from Vercel if present — this app does not call OpenAI.

Turn off **Vercel Deployment Protection** (team SSO) so your app-level password flow works — it caused 401s before.

## What was fixed

| Problem | Fix |
|--------|-----|
| `framework: null` — Vercel treated app as static site | Added `vercel.json` with `"framework": "nextjs"` |
| 136 MB content upload | `prebuild` copies only ~200 KB of app content |
| CLI deploys stuck / UNKNOWN | Use `npm run deploy` (prebuilt deploy) |
| Missing content on Vercel | `prepare-content.js` bundles modules, curriculum, etc. |
