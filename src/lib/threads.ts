import { useSyncExternalStore } from "react";
import type { UIMessage } from "ai";

export type Thread = { id: string; title: string; updatedAt: number; messages: UIMessage[] };
const KEY = "atlas-chat-threads";
const EMPTY: Thread[] = [];
let cachedRaw: string | null = null;
let cachedThreads: Thread[] = EMPTY;

function readStorage(): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(KEY); } catch { return null; }
}

function isMessage(value: unknown): value is UIMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<UIMessage>;
  return typeof message.id === "string" &&
    ["user", "assistant", "system"].includes(message.role ?? "") &&
    Array.isArray(message.parts) && message.parts.every((part) =>
      part && typeof part === "object" && typeof part.type === "string" &&
      (!(part.type === "text" || part.type === "reasoning") || typeof part.text === "string"));
}

function parseThreads(raw: string | null): Thread[] {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter((item): item is Thread => item && typeof item === "object" &&
      typeof item.id === "string" && typeof item.title === "string" &&
      typeof item.updatedAt === "number" && Number.isFinite(item.updatedAt) &&
      Array.isArray(item.messages) && item.messages.every(isMessage));
  } catch { return EMPTY; }
}

function snapshot(): Thread[] {
  const raw = readStorage();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedThreads = parseThreads(raw);
  }
  return cachedThreads;
}

function subscribe(callback: () => void) {
  window.addEventListener("atlas-threads", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("atlas-threads", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useThreads() {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

export function loadThreads(): Thread[] {
  return snapshot();
}
export function saveThreads(t: Thread[]) {
  if (typeof window === "undefined") return;
  cachedThreads = t;
  cachedRaw = readStorage();
  try {
    const raw = JSON.stringify(t);
    window.localStorage.setItem(KEY, raw);
    cachedRaw = raw;
  } catch {
    // Storage full or blocked: keep the in-memory thread list for this session.
  }
  window.dispatchEvent(new Event("atlas-threads"));
}
export function createThread(): Thread {
  const t: Thread = { id: crypto.randomUUID().slice(0, 8), title: "New conversation", updatedAt: Date.now(), messages: [] };
  saveThreads([t, ...loadThreads()]);
  return t;
}
export function ensureThread(id: string) {
  const all = loadThreads();
  if (!all.some((t) => t.id === id)) saveThreads([{ id, title: "New conversation", updatedAt: Date.now(), messages: [] }, ...all]);
}
export function updateThreadMessages(id: string, messages: UIMessage[]) {
  const all = loadThreads();
  const firstText = messages.find((m) => m.role === "user")?.parts.find((p) => p.type === "text");
  const next = all.map((t) =>
    t.id === id
      ? { ...t, messages, updatedAt: Date.now(),
          title: t.title === "New conversation" && firstText && "text" in firstText ? firstText.text.slice(0, 40) : t.title }
      : t,
  );
  saveThreads(next);
}
export function deleteThread(id: string) {
  saveThreads(loadThreads().filter((t) => t.id !== id));
}
