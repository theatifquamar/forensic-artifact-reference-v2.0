import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "far-bookmarks";

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveBookmarks(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    /* ignore write failures (private browsing, quota, etc.) */
  }
}

// A bookmark is identified by the artifact name + OS + category (stable across sessions)
function keyFor(a) {
  return `${a._os || a.os}::${a._cat || a.cat}::${a.artifact}`;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(loadBookmarks);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (a, os, cat) => {
      const key = `${a._os || os}::${a._cat || cat}::${a.artifact}`;
      return bookmarks.some((b) => b.key === key);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback((a, os, cat) => {
    const enriched = { ...a, _os: a._os || os, _cat: a._cat || cat };
    const k = keyFor(enriched);
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.key === k);
      if (exists) return prev.filter((b) => b.key !== k);
      return [...prev, { key: k, artifact: enriched, addedAt: Date.now() }];
    });
  }, []);

  const clearAll = useCallback(() => setBookmarks([]), []);

  return { bookmarks, isBookmarked, toggleBookmark, clearAll };
}
