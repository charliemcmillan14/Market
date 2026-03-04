# MarketCat

Real-time market data dashboard with Supabase auth and Finnhub API.

## Project structure

```
marketcat/
├── api/              ← Vercel serverless functions (run server-side, hide API keys)
│   ├── quote.js      GET /api/quote?symbol=AAPL
│   ├── movers.js     GET /api/movers
│   ├── candles.js    GET /api/candles?symbol=AAPL&resolution=15&days=30
│   └── news.js       GET /api/news?symbol=AAPL&days=7
├── public/           ← Static frontend files
│   ├── index.html
│   ├── app.js
│   ├── app.css
│   ├── ui.js
│   ├── state.js
│   └── supabase.js
├── vercel.json       ← Routing config
└── README.md
```

## Deploy to Vercel (free)

> ⚠ This project uses serverless API routes — it cannot run on GitHub Pages.
> Use Vercel (free tier covers this easily).

### 1. Get API keys

| Service | URL | Notes |
|---------|-----|-------|
| Finnhub | https://finnhub.io/register | Free — 60 calls/min |
| Supabase | https://supabase.com | Free — create a project, get URL + anon key |

### 2. Add your Supabase keys to index.html

Open `public/index.html` and replace:
```js
window.__ENV__ = {
  SUPABASE_URL:      "PASTE_SUPABASE_URL",
  SUPABASE_ANON_KEY: "PASTE_SUPABASE_ANON_KEY"
};
```
with your real Supabase project URL and anon key.

### 3. Push to GitHub

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/marketcat.git
git push -u origin main
```

### 4. Deploy on Vercel

1. Go to https://vercel.com → New Project → Import your GitHub repo
2. In **Environment Variables**, add:
   - `FINNHUB_API_KEY` = your Finnhub key
3. Click Deploy. Done.

### 5. Enable Supabase Auth

In your Supabase dashboard:
- Authentication → Settings → set your Vercel URL as Site URL
- Enable Email auth (it's on by default)
- Create a test user: Authentication → Users → Invite User

---

## Running locally

Install Vercel CLI:
```bash
npm i -g vercel
```

Create a `.env.local` file in the project root:
```
FINNHUB_API_KEY=your_key_here
```

Run:
```bash
vercel dev
```

Then open http://localhost:3000
