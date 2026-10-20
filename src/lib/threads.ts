import type { UIMessage } from "ai";

export type Thread = { id: string; title: string; updatedAt: number; messages: UIMessage[] };
const KEY = "atlas-chat-threads";

export function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveThreads(t: Thread[]) {
  localStorage.setItem(KEY, JSON.stringify(t));
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
