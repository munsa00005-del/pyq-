import { useState, useEffect, useCallback } from "react";

const KEY = "prepverse.progress.v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt storage */
  }
  return { attempts: {}, bookmarks: {} };
}

// attempts: { [questionId]: { correct: boolean, chosen: number|string, at: number } }
// bookmarks: { [questionId]: true }
export function useProgress() {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage may be full / blocked */
    }
  }, [state]);

  const record = useCallback((id, correct, chosen) => {
    setState((s) => ({
      ...s,
      attempts: { ...s.attempts, [id]: { correct, chosen, at: Date.now() } },
    }));
  }, []);

  const toggleBookmark = useCallback((id) => {
    setState((s) => {
      const next = { ...s.bookmarks };
      if (next[id]) delete next[id];
      else next[id] = true;
      return { ...s, bookmarks: next };
    });
  }, []);

  const reset = useCallback(() => setState({ attempts: {}, bookmarks: {} }), []);

  const stats = (() => {
    const all = Object.values(state.attempts);
    const done = all.length;
    const correct = all.filter((a) => a.correct).length;
    return {
      done,
      correct,
      accuracy: done ? Math.round((correct / done) * 100) : 0,
      bookmarks: Object.keys(state.bookmarks).length,
    };
  })();

  return { state, record, toggleBookmark, reset, stats };
}
