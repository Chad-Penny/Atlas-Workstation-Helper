import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { ToolPage } from "@/components/app/ToolPage";

const t = "AI Research Assistant — Atlas Workspace";
const d = "Get structured research briefings with findings, trade-offs and next steps.";
export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => (
    <ToolPage tool="research" title="AI Research Assistant" description={d} icon={<Search />} required="topic"
      fields={[
        { name: "topic", label: "Topic", type: "text", placeholder: "e.g. Four-day work week impact on productivity" },
        { name: "audience", label: "Audience", type: "select", options: ["Business professionals", "Executives", "Technical team", "General audience"] },
        { name: "depth", label: "Depth", type: "select", options: ["Overview", "Detailed analysis", "Quick facts"] },
        { name: "questions", label: "Specific questions", type: "textarea", placeholder: "- What do pilot studies show?\n- Risks for client-facing teams?" },
      ]} />
  ),
});
