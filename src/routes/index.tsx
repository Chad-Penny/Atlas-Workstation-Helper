import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { NAV } from "@/components/app/AppSidebar";
import { Disclaimer } from "@/components/app/Disclaimer";

const t = "Atlas — AI Workplace Productivity Assistant";
const d = "Automate emails, meeting notes, planning and research with AI.";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] }),
  component: Index,
});

const BLURB: Record<string, string> = {
  "/email": "Draft clear, on-tone emails from a few bullet points.",
  "/meetings": "Summaries, decisions and action items from raw notes.",
  "/tasks": "Prioritized, time-blocked plans for your week.",
  "/research": "Structured briefings with findings and next steps.",
  "/chat": "Ask anything work-related in a running conversation.",
};

function Index() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      <section className="rounded-3xl bg-hero p-8 text-primary-foreground shadow-soft md:p-10">
        <p className="text-sm font-medium opacity-80">Good to see you</p>
        <h1 className="mt-1 max-w-2xl text-3xl font-semibold md:text-4xl">Your AI workplace assistant</h1>
        <p className="mt-3 max-w-xl opacity-85">{d} Every output is editable, so you stay in control.</p>
        <Link to="/chat" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-highlight px-4 py-2 text-sm font-semibold text-highlight-foreground hover:opacity-90">
          Start a chat <ArrowRight className="size-4" />
        </Link>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold">Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NAV.slice(1).map((n) => (
            <Link key={n.url} to={n.url} className="group rounded-2xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40">
              <div className="mb-4 grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground"><n.icon className="size-5" /></div>
              <h3 className="font-semibold">{n.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{BLURB[n.url]}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Open <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
      </section>
      <Disclaimer />
    </div>
  );
}
