import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "far-recently-viewed";
const MAX_ITEMS = 12;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function save(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    /* ignore write failures */
  }
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useState(load);

  useEffect(() => {
    save(recent);
  }, [recent]);

  // Records a view — moves the artifact to the front, dedupes, caps list length.
  const recordView = useCallback((artifact, os, cat) => {
    const entry = {
      artifact: { ...artifact, _os: artifact._os || os, _cat: artifact._cat || cat },
      viewedAt: Date.now(),
    };
    setRecent((prev) => {
      const filtered = prev.filter((r) => r.artifact.artifact !== artifact.artifact || r.artifact._os !== entry.artifact._os);
      return [entry, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clearAll = useCallback(() => setRecent([]), []);

  return { recent, recordView, clearAll };
}
