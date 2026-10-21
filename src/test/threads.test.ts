import { beforeEach, describe, expect, it, vi } from "vitest";
import { createThread, loadThreads, saveThreads, updateThreadMessages, deleteThread } from "@/lib/threads";

describe("Browser-saved chat history", () => {
  beforeEach(() => { localStorage.clear(); saveThreads([]); });

  it("keeps a stable snapshot while history is unchanged", () => {
    createThread();
    expect(loadThreads()).toBe(loadThreads());
  });

  it("ignores corrupted and non-array saved history", () => {
    localStorage.setItem("atlas-chat-threads", "broken-json");
    expect(loadThreads()).toEqual([]);
    localStorage.setItem("atlas-chat-threads", '{"not":"a list"}');
    expect(loadThreads()).toEqual([]);
  });

  it("ignores malformed threads and messages", () => {
    localStorage.setItem("atlas-chat-threads", JSON.stringify([
      null, { id: "bad", title: "Broken", updatedAt: 10, messages: [{ id: "m", role: "user", parts: null }] },
      { id: "good", title: "Valid", updatedAt: 20, messages: [] },
    ]));
    expect(loadThreads().map((thread) => thread.id)).toEqual(["good"]);
  });

  it("retains conversations for the session when storage is blocked", () => {
    const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Blocked"); });
    const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Blocked"); });
    try {
      const thread = createThread();
      expect(loadThreads().map((item) => item.id)).toEqual([thread.id]);
    } finally { get.mockRestore(); set.mockRestore(); }
  });

  it("saves messages separately per thread and removes only the chosen thread", () => {
    const first = createThread();
    const second = createThread();
    updateThreadMessages(first.id, [{ id: "message", role: "user", parts: [{ type: "text", text: "Plan my week" }] }]);
    expect(loadThreads().find((thread) => thread.id === first.id)?.messages).toHaveLength(1);
    expect(loadThreads().find((thread) => thread.id === second.id)?.messages).toEqual([]);
    deleteThread(first.id);
    expect(loadThreads().map((thread) => thread.id)).toEqual([second.id]);
  });
});