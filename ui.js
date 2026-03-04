// public/ui.js
// UI helpers — toast notifications, loading state, formatting

// ── Toast ──────────────────────────────────────────────────────────────────
let _toastTimer;
export function toast(msg, type = 'info') {
  let el = document.getElementById('mc-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mc-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = 'mc-toast mc-toast--' + type + ' mc-toast--show';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('mc-toast--show'), 3000);
}

// ── Loading spinner ────────────────────────────────────────────────────────
export function setLoading(show) {
  const el = document.getElementById('mc-spinner');
  if (el) el.style.display = show ? 'flex' : 'none';
}

// ── Number formatting ──────────────────────────────────────────────────────
export function fmtPrice(n) {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 1)    return '$' + n.toFixed(2);
  return '$' + n.toFixed(4);
}

export function fmtChange(chg, pct) {
  if (chg == null) return '—';
  const sign  = chg >= 0 ? '+' : '';
  const cls   = chg >= 0 ? 'pos' : 'neg';
  const arrow = chg >= 0 ? '▲' : '▼';
  return `<span class="chg ${cls}">${arrow} ${sign}${chg.toFixed(2)} (${sign}${pct.toFixed(2)}%)</span>`;
}

export function fmtTime(unixSec) {
  if (!unixSec) return '—';
  return new Date(unixSec * 1000).toLocaleString();
}

// ── Quote card ─────────────────────────────────────────────────────────────
export function renderQuote(q) {
  if (!q) return '<div class="empty">No quote data.</div>';
  return `
    <div class="quote-card">
      <div class="quote-symbol">${q.symbol}</div>
      <div class="quote-price">${fmtPrice(q.price)}</div>
      <div class="quote-change">${fmtChange(q.change, q.changePct)}</div>
      <div class="quote-meta">
        <span>O: ${fmtPrice(q.open)}</span>
        <span>H: ${fmtPrice(q.high)}</span>
        <span>L: ${fmtPrice(q.low)}</span>
        <span>Prev: ${fmtPrice(q.prevClose)}</span>
      </div>
    </div>`;
}

// ── Movers table ───────────────────────────────────────────────────────────
export function renderMovers(movers) {
  if (!movers?.length) return '<div class="empty">No data.</div>';
  const rows = movers.map(m => {
    const cls = m.changePct >= 0 ? 'pos' : 'neg';
    const arrow = m.changePct >= 0 ? '▲' : '▼';
    return `<tr>
      <td class="sym-cell" data-sym="${m.symbol}">${m.symbol}</td>
      <td>${fmtPrice(m.price)}</td>
      <td class="${cls}">${arrow} ${m.changePct >= 0 ? '+' : ''}${m.changePct?.toFixed(2)}%</td>
      <td class="${cls}">${m.change >= 0 ? '+' : ''}${m.change?.toFixed(2)}</td>
    </tr>`;
  }).join('');
  return `<table class="movers-table">
    <thead><tr><th>Symbol</th><th>Price</th><th>Chg%</th><th>Chg</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

// ── News feed ──────────────────────────────────────────────────────────────
export function renderNews(articles) {
  if (!articles?.length) return '<div class="empty">No news found.</div>';
  return articles.map(a => {
    const d = new Date(a.datetime * 1000).toLocaleDateString();
    return `<article class="news-item">
      ${a.image ? `<img class="news-img" src="${a.image}" alt="" loading="lazy"/>` : ''}
      <div class="news-body">
        <div class="news-source">${a.source} · ${d}</div>
        <a class="news-hl" href="${a.url}" target="_blank" rel="noopener">${a.headline}</a>
        <p class="news-sum">${(a.summary || '').slice(0, 180)}${a.summary?.length > 180 ? '…' : ''}</p>
      </div>
    </article>`;
  }).join('');
}
