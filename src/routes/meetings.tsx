import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { ToolPage } from "@/components/app/ToolPage";

const t = "Meeting Notes Summarizer — Atlas Workplace AI";
const d = "Turn messy notes or transcripts into summaries, decisions and action items.";
export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => (
    <ToolPage tool="meeting" title="Meeting Notes Summarizer" description={d} icon={<NotebookPen />} required="notes"
      fields={[
        { name: "title", label: "Meeting title", type: "text", placeholder: "e.g. Weekly product sync" },
        { name: "focus", label: "Focus", type: "select", options: ["Balanced overview", "Action items", "Decisions", "Executive brief"] },
        { name: "notes", label: "Notes or transcript", type: "textarea", rows: 12, placeholder: "Paste your raw meeting notes here…" },
      ]} />
  ),
});
