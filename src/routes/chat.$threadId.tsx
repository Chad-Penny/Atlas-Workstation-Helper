import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUp, Compass, Plus, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Disclaimer } from "@/components/app/Disclaimer";
import { ChatError } from "@/components/app/ChatError";
import { createThread, deleteThread, ensureThread, loadThreads, updateThreadMessages, useThreads } from "@/lib/threads";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "AI Chat — Atlas Workplace AI" },
      { name: "description", content: "Chat with Atlas, your AI workplace assistant." },
      { property: "og:title", content: "AI Chat — Atlas Workplace AI" },
      { property: "og:description", content: "Chat with Atlas, your AI workplace assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  ssr: false,
  component: ChatPage,
  errorComponent: ChatError,
});

function ChatPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const threads = useThreads();
  useEffect(() => ensureThread(threadId), [threadId]);
  const sorted = [...threads].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex h-[calc(100svh-3.5rem)]">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
        <div className="p-3">
          <Button className="w-full" onClick={() => navigate({ to: "/chat/$threadId", params: { threadId: createThread().id } })}>
            <Plus /> New chat
          </Button>
        </div>
        <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
          {sorted.map((t) => (
            <div key={t.id} className={cn("group flex items-center rounded-lg", t.id === threadId ? "bg-accent text-accent-foreground" : "hover:bg-muted")}>
              <Link to="/chat/$threadId" params={{ threadId: t.id }} className="flex-1 truncate px-3 py-2 text-sm">{t.title}</Link>
               <Button size="icon" variant="ghost" aria-label="Delete conversation" title="Delete conversation" className="mr-1 size-7 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
                onClick={() => {
                  deleteThread(t.id);
                  if (t.id === threadId) {
                    const next = loadThreads()[0] ?? createThread();
                    navigate({ to: "/chat/$threadId", params: { threadId: next.id } });
                  }
                }}>
                <Trash2 className="size-3.5" />
               </Button>
            </div>
          ))}
        </div>
      </aside>
      <ChatWindow key={threadId} threadId={threadId} onNew={() => navigate({ to: "/chat/$threadId", params: { threadId: createThread().id } })} />
    </div>
  );
}

const STARTERS = ["Help me write a polite follow-up to a client", "How do I prioritize a packed week?", "Give me an agenda for a 30-min kickoff meeting"];

function ChatWindow({ threadId, onNew }: { threadId: string; onNew: () => void }) {
  const [initial] = useState(() => loadThreads().find((t) => t.id === threadId)?.messages ?? []);
  const [input, setInput] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat", body: { threadId } }), [threadId]);
  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initial,
    transport,
    onError: (e) => toast.error(e.message || "Chat failed"),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => { if (status === "ready" && messages.length) updateThreadMessages(threadId, messages); }, [status, messages, threadId]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => bottom.current?.scrollIntoView({ behavior: "instant", block: "end" }));
    return () => cancelAnimationFrame(frame);
  }, [messages]);
  useEffect(() => { if (!busy) ta.current?.focus(); }, [busy]);

  function send(text: string) {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center justify-end border-b px-4 py-2 md:hidden">
        <Button size="sm" variant="outline" onClick={onNew}><Plus /> New chat</Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
          {messages.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-hero text-primary-foreground"><Compass /></div>
              <h2 className="text-xl font-semibold">How can Atlas help today?</h2>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {STARTERS.map((s) => (
                  <Button key={s} variant="outline" onClick={() => send(s)} className="h-auto max-w-full whitespace-normal py-2">{s}</Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
              {m.role === "assistant" && <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-hero text-primary-foreground"><Compass className="size-3.5" /></div>}
              <div className={cn(m.role === "user" ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground" : "min-w-0 flex-1")}>
                {m.parts.map((p, i) => {
                  if (p.type === "text") return m.role === "user"
                    ? <p key={i} className="whitespace-pre-wrap break-words">{p.text}</p>
                    : <div key={i} className="prose-ai"><ReactMarkdown remarkPlugins={[remarkGfm]}>{p.text}</ReactMarkdown></div>;
                  if (p.type === "reasoning" && p.text) return (
                    <details key={i} className="mb-2 text-xs text-muted-foreground"><summary className="cursor-pointer">Thinking</summary><p className="mt-1 whitespace-pre-wrap">{p.text}</p></details>
                  );
                  return null;
                })}
              </div>
            </div>
          ))}
          {status === "submitted" && (
            <div className="flex gap-3"><div className="grid size-7 place-items-center rounded-lg bg-hero text-primary-foreground"><Compass className="size-3.5" /></div>
              <div className="flex items-center gap-1 pt-2">{[0, 1, 2].map((i) => <span key={i} className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 120}ms` }} />)}</div></div>
          )}
          <div ref={bottom} />
        </div>
      </div>
      <div className="mx-auto w-full max-w-3xl space-y-2 px-4 pb-4">
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-soft">
          <Textarea ref={ta} autoFocus rows={1} value={input} placeholder="Message Atlas…" onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            className="max-h-40 min-h-10 resize-none border-0 shadow-none focus-visible:ring-0" />
          {busy ? (
            <Button type="button" size="icon" variant="secondary" onClick={() => stop()} aria-label="Stop"><Square /></Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send"><ArrowUp /></Button>
          )}
        </form>
        <Disclaimer compact />
      </div>
    </div>
  );
}
