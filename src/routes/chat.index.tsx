import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { createThread, loadThreads } from "@/lib/threads";
import { ChatError } from "@/components/app/ChatError";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "Open Conversations — Atlas Workspace" },
      { name: "description", content: "Open your latest Atlas workplace conversation or start a new chat." },
      { property: "og:title", content: "Open Conversations — Atlas Workspace" },
      { property: "og:description", content: "Open your latest Atlas workplace conversation or start a new chat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatIndex,
  errorComponent: ChatError,
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
