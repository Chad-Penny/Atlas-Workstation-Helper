import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV } from "@/components/app/AppSidebar";
import { Disclaimer } from "@/components/app/Disclaimer";

const t = "Atlas — Your Helpful AI Companion";
const d = "Meet Atlas, your helpful AI companion for emails, meeting notes, planning and research.";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
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
      <section className="border-b pb-8 pt-3 md:pt-5">
        <div className="mb-5 grid size-14 place-items-center rounded-lg bg-primary text-primary-foreground shadow-raised"><Compass className="size-7" /></div>
        <p className="text-sm font-medium text-primary">Welcome! It’s good to have you here.</p>
        <h1 className="mt-2 max-w-2xl text-4xl font-semibold md:text-5xl">Atlas</h1>
        <p className="mt-3 max-w-xl text-lg text-foreground">I’m Atlas, your AI companion. I’m here to help you make your workday a little easier.</p>
        <Button asChild className="mt-6 shadow-raised"><Link to="/chat">Chat with Atlas <ArrowRight className="size-4" /></Link></Button>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold">Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NAV.slice(1).map((n) => (
            <Link key={n.url} to={n.url} className="group rounded-lg border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
