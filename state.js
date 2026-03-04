// public/state.js
// Central app state — import and mutate via setState()

export const state = {
  symbol:   'AAPL',
  user:     null,       // Supabase user object after login
  quote:    null,       // current quote data
  candles:  [],         // current candle array
  movers:   [],         // top movers list
  news:     [],         // news articles for current symbol
  loading:  false,
};

// Simple pub/sub so modules can react to state changes
const _listeners = [];

export function onStateChange(fn) {
  _listeners.push(fn);
}

export function setState(patch) {
  Object.assign(state, patch);
  _listeners.forEach(fn => fn(state));
}
