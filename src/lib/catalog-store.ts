import { useSyncExternalStore } from "react";
import { catalog as baseCatalog, type Title } from "./catalog";

const KEY = "ts-catalog-v1";

let cache: Title[] = baseCatalog;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* ignore quota */
  }
}

function load() {
  if (typeof window === "undefined" || loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Title[];
      if (Array.isArray(parsed)) {
        cache = parsed;
        emit();
      }
    }
  } catch {
    /* ignore */
  }
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

const getSnapshot = () => cache;
const getServerSnapshot = () => baseCatalog;

export function useCatalog(): Title[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useTitle(id: string): Title | undefined {
  const list = useCatalog();
  return list.find((t) => t.id === id);
}

// Imperative helpers (also load before reading on client)
export function getCatalog(): Title[] {
  load();
  return cache;
}

export function findTitle(id: string): Title | undefined {
  return getCatalog().find((t) => t.id === id);
}

export function upsertTitle(t: Title) {
  load();
  const idx = cache.findIndex((x) => x.id === t.id);
  if (idx >= 0) {
    cache = cache.map((x, i) => (i === idx ? t : x));
  } else {
    cache = [t, ...cache];
  }
  persist();
  emit();
}

export function deleteTitle(id: string) {
  load();
  cache = cache.filter((t) => t.id !== id);
  persist();
  emit();
}

export function resetCatalog() {
  cache = baseCatalog;
  persist();
  emit();
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

export function uniqueId(base: string): string {
  const list = getCatalog();
  let id = base || `title-${Date.now()}`;
  let n = 2;
  while (list.some((t) => t.id === id)) {
    id = `${base}-${n++}`;
  }
  return id;
}
