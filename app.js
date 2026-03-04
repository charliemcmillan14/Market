// public/app.js
// Main app — auth flow, data loading, event wiring

import { supabase, getSession, signIn, signUp, signOut } from './supabase.js';
import { state, setState } from './state.js';
import { toast, setLoading, renderQuote, renderMovers, renderNews } from './ui.js';

// ── DOM refs ───────────────────────────────────────────────────────────────
const authView   = document.getElementById('auth');
const appView    = document.getElementById('app');
const emailEl    = document.getElementById('email');
const passEl     = document.getElementById('password');
const signinBtn  = document.getElementById('signin');
const signupBtn  = document.getElementById('signup');
const signoutBtn = document.getElementById('signout');
const symInput   = document.getElementById('sym-input');
const symForm    = document.getElementById('sym-form');
const quoteEl    = document.getElementById('quote');
const moversEl   = document.getElementById('movers');
const newsEl     = document.getElementById('news');
const userEl     = document.getElementById('user-email');

// ── Boot ───────────────────────────────────────────────────────────────────
(async function boot() {
  // Check for an existing Supabase session (user already logged in)
  const session = await getSession();
  if (session?.user) {
    showApp(session.user);
  }
})();

// ── Auth ───────────────────────────────────────────────────────────────────
signinBtn.addEventListener('click', async () => {
  const email = emailEl.value.trim();
  const pass  = passEl.value.trim();
  if (!email || !pass) { toast('Enter email and password', 'error'); return; }
  setLoading(true);
  try {
    const user = await signIn(email, pass);
    showApp(user);
    toast('Welcome back!', 'success');
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    setLoading(false);
  }
});

signupBtn.addEventListener('click', async () => {
  const email = emailEl.value.trim();
  const pass  = passEl.value.trim();
  if (!email || !pass) { toast('Enter email and password', 'error'); return; }
  if (pass.length < 6)  { toast('Password must be 6+ characters', 'error'); return; }
  setLoading(true);
  try {
    await signUp(email, pass);
    toast('Account created — check your email to confirm, then sign in.', 'success');
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    setLoading(false);
  }
});

signoutBtn.addEventListener('click', async () => {
  await signOut();
  setState({ user: null, quote: null, movers: [], news: [] });
  showAuth();
  toast('Signed out.');
});

// ── Symbol search ──────────────────────────────────────────────────────────
symForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const sym = symInput.value.trim().toUpperCase();
  if (!sym) return;
  setState({ symbol: sym });
  await loadSymbolData(sym);
});

// Click a mover row to load that symbol
document.addEventListener('click', async (e) => {
  const cell = e.target.closest('.sym-cell');
  if (!cell) return;
  const sym = cell.dataset.sym;
  if (!sym) return;
  symInput.value = sym;
  setState({ symbol: sym });
  await loadSymbolData(sym);
});

// ── Data loading ───────────────────────────────────────────────────────────
async function loadSymbolData(symbol) {
  setLoading(true);
  try {
    const [quoteData, newsData] = await Promise.all([
      apiFetch(`/api/quote?symbol=${symbol}`),
      apiFetch(`/api/news?symbol=${symbol}&days=7`),
    ]);
    setState({ quote: quoteData, news: newsData.articles || [] });
    quoteEl.innerHTML = renderQuote(quoteData);
    newsEl.innerHTML  = renderNews(state.news);

    // Also update the page title
    document.title = `${symbol} ${quoteData.price?.toFixed(2)} — MarketCat`;
  } catch (err) {
    toast('Failed to load ' + symbol + ': ' + err.message, 'error');
  } finally {
    setLoading(false);
  }
}

async function loadMovers() {
  try {
    const data = await apiFetch('/api/movers');
    setState({ movers: data });
    moversEl.innerHTML = renderMovers(data);
  } catch (err) {
    console.error('movers:', err);
    moversEl.innerHTML = '<div class="empty">Could not load movers.</div>';
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
async function apiFetch(url) {
  const r = await fetch(url);
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || `HTTP ${r.status}`);
  }
  return r.json();
}

function showApp(user) {
  setState({ user });
  authView.style.display = 'none';
  appView.style.display  = 'block';
  if (userEl) userEl.textContent = user.email;
  // Load initial data
  loadMovers();
  loadSymbolData(state.symbol);
  // Auto-refresh quote every 30 seconds
  setInterval(() => {
    if (state.symbol) loadSymbolData(state.symbol);
  }, 30000);
}

function showAuth() {
  authView.style.display = 'block';
  appView.style.display  = 'none';
}
