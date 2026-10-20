import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { createThread, loadThreads } from "@/lib/threads";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "AI Chat — Atlas Workplace AI" },
      { name: "description", content: "Chat with Atlas, your AI workplace assistant." },
      { property: "og:title", content: "AI Chat — Atlas Workplace AI" },
      { property: "og:description", content: "Chat with Atlas, your AI workplace assistant." },
    ],
  }),
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const t = loadThreads().sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? createThread();
    navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
  }, [navigate]);
  return <div className="p-8 text-sm text-muted-foreground">Opening chat…</div>;
}
