import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, Compass, MessagesSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV } from '@/components/app/AppSidebar';
import { Disclaimer } from '@/components/app/Disclaimer';
import { WorkspacePulse } from '@/components/app/WorkspacePulse';
import compassImage from '@/assets/atlas-compass.jpg';

const title = 'Atlas Workspace — Your AI-powered work assistant';
const description = 'Your work, mapped out. Your day, simplified. Draft emails, summarize meetings, plan tasks and research with Atlas.';
export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Index,
});
const tools = [
  { url: '/email', category: 'WRITE', title: 'Find the right words.', detail: 'Clear emails. The right tone. Ready for your review.', action: 'Draft an email' },
  { url: '/meetings', category: 'CAPTURE', title: 'Keep the important parts.', detail: 'Turn a meeting into decisions and next steps.', action: 'Summarize a meeting' },
  { url: '/tasks', category: 'ORGANIZE', title: 'Make room for what matters.', detail: 'Bring priorities and a realistic plan into focus.', action: 'Plan my tasks' },
  { url: '/research', category: 'EXPLORE', title: 'Get a clearer picture.', detail: 'Structured findings for your next decision.', action: 'Start researching' },
] as const;

function Index() {
  return <div className="mx-auto max-w-7xl space-y-7 p-4 md:p-7 lg:p-9">
    <div className="flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground">YOUR WORKSPACE / OVERVIEW</p><span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="size-1.5 rounded-full bg-cobalt" />Here to help</span></div>
    <section className="workspace-hero">
      <img src={compassImage} alt="A precision compass in brushed titanium and amber brass" width={1536} height={768} className="workspace-hero-image" fetchPriority="high" />
      <div className="workspace-hero-copy"><p className="mb-4 flex items-center gap-2 text-xs font-medium"><Compass className="size-4" />GOOD TO HAVE YOU HERE</p><h1 className="font-display text-3xl font-semibold md:text-4xl">Atlas Workspace</h1><p className="mt-3 max-w-sm text-xl font-medium">Your work, mapped out.<br />Your day, simplified.</p><p className="mt-4 max-w-sm text-sm leading-relaxed">I’m Atlas, your AI-powered work assistant.<br />Let’s take something off your plate.</p><Button asChild className="mt-5 shadow-raised"><Link to="/chat">Let’s get started <ArrowRight /></Link></Button></div>
    </section>
    <section>
      <div className="mb-4 flex items-end justify-between gap-3"><h2 className="font-display text-lg font-semibold">What’s on your desk?</h2><span className="text-[11px] text-muted-foreground">04 WORK TOOLS</span></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{tools.map((tool, index) => {
        const Icon = NAV.find(item => item.url === tool.url)?.icon ?? Compass;
        return <Link key={tool.url} to={tool.url} className="group flex min-w-0 flex-col rounded-md border bg-card p-5 shadow-soft transition-transform hover:-translate-y-1 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="mb-7 flex items-center justify-between"><Icon className="size-5 text-primary" /><span className="tool-number text-xs text-muted-foreground">0{index + 1}</span></div><p className="mb-2 text-[10px] font-semibold text-cobalt">{tool.category}</p><h3 className="text-base font-semibold">{tool.title}</h3><p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{tool.detail}</p><span className="mt-5 flex items-center justify-between border-t pt-4 text-xs font-semibold">{tool.action}<ArrowUpRight className="size-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></Link>;
      })}</div>
      <Button asChild variant="ghost" className="mt-3 h-auto w-full justify-between whitespace-normal px-1 py-3"><Link to="/chat"><span className="flex items-center gap-2 text-sm"><MessagesSquare className="text-primary" />Something else on your mind?</span><span className="flex shrink-0 items-center gap-1 text-xs text-primary">Ask Atlas <ArrowRight /></span></Link></Button>
    </section>
    <WorkspacePulse />
    <Disclaimer />
  </div>;
}
