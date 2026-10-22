import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { ToolPage } from "@/components/app/ToolPage";

const t = "AI Task Planner — Atlas Workspace";
const d = "Prioritize your to-dos and get a realistic, time-blocked schedule.";
export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => (
    <ToolPage tool="tasks" title="AI Task Planner" description={d} icon={<ListChecks />} required="tasks"
      fields={[
        { name: "goal", label: "Main goal", type: "text", placeholder: "e.g. Ship the onboarding redesign" },
        { name: "timeframe", label: "Timeframe", type: "select", options: ["This week", "Today", "Next 2 weeks", "This month"] },
        { name: "hours", label: "Focus hours per day", type: "text", placeholder: "e.g. 5" },
        { name: "tasks", label: "Tasks", type: "textarea", rows: 8, placeholder: "- Review design specs\n- Write release notes\n- 1:1 with Alex" },
      ]} />
  ),
});
