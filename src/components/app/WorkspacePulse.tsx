import { useState } from 'react';
import { ArrowUpRight, ChevronDown, Clock3, Star, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspaceStats } from './WorkspaceStatsProvider';
import { WorkspaceSurvey } from './WorkspaceSurvey';

export function WorkspacePulse() {
  const { counts, feedback, loading, error, refresh } = useWorkspaceStats();
  const [expanded, setExpanded] = useState(false);
  const total = counts.email + counts.meeting + counts.tasks + counts.research;
  const items = [['Emails drafted', counts.email], ['Meetings summarized', counts.meeting], ['Task plans created', counts.tasks], ['Research briefings', counts.research], ['Conversations started', counts.conversation]] as const;
  return <section aria-label="Workspace statistics" className="border-y py-6">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-cobalt" /><h2 className="text-sm font-semibold">Your workspace, in motion</h2></div><WorkspaceSurvey /></div>
    <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
      <div className="pr-4"><p className="text-xs text-muted-foreground">Prompts written</p><p className="mt-2 font-display text-3xl font-semibold">{loading ? '—' : counts.prompt}</p></div>
      <div className="border-l pl-5"><p className="text-xs text-muted-foreground">Work outputs</p><p className="mt-2 font-display text-3xl font-semibold">{loading ? '—' : total}<ArrowUpRight className="ml-2 inline size-4 text-cobalt" /></p></div>
      <div className="md:border-l md:pl-5"><p className="text-xs text-muted-foreground">Time saved <span className="text-[10px]">· your estimate</span></p><p className="mt-2 flex items-baseline gap-2 font-display text-3xl font-semibold">{feedback ? (feedback.minutesSaved / 60).toFixed(1) : '—'}<span className="font-sans text-xs font-normal text-muted-foreground">hrs</span></p></div>
      <div className="border-l pl-5"><p className="text-xs text-muted-foreground">Your helpfulness rating</p><p className="mt-2 font-display text-3xl font-semibold">{feedback?.rating ?? '—'}<Star className="mx-1 inline size-5 fill-primary text-primary" /><span className="font-sans text-xs font-normal text-muted-foreground">/ 5</span></p></div>
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-2"><p className="text-[11px] text-muted-foreground">Activity since tracking began · this browser’s workspace</p><Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}><ChevronDown className={expanded ? 'rotate-180' : ''} />{expanded ? 'Less detail' : 'Activity breakdown'}</Button></div>
    {expanded && <div className="mt-3 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3 lg:grid-cols-5">{items.map(([label, value]) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>)}</div>}
    {error && <div role="status" className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{error}<Button variant="ghost" size="sm" onClick={refresh}><RefreshCw />Retry</Button></div>}
  </section>;
}