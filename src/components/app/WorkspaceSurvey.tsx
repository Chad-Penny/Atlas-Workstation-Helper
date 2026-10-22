import { useState } from 'react';
import { Star, MessageSquareHeart, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWorkspaceStats } from './WorkspaceStatsProvider';
import { feedbackSchema } from '@/lib/workspace-stats';

export function WorkspaceSurvey({ compact = false }: { compact?: boolean }) {
  const { feedback, submitFeedback } = useWorkspaceStats();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [minutes, setMinutes] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  async function submit() {
    const parsed = feedbackSchema.safeParse({ rating, minutesSaved: minutes.trim() ? Number(minutes) : NaN, note });
    if (!parsed.success) { toast.error('Choose 1–5 stars and enter a whole number of minutes saved.'); return; }
    setSaving(true);
    try { await submitFeedback(parsed.data); setOpen(false); toast.success('Thank you. Your feedback is saved.'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Feedback could not be saved.'); }
    finally { setSaving(false); }
  }
  return <Dialog open={open} onOpenChange={value => { setOpen(value); if (value) { setRating(feedback?.rating ?? 0); setMinutes(feedback ? String(feedback.minutesSaved) : ''); setNote(feedback?.note ?? ''); } }}>
    <DialogTrigger asChild><Button variant={compact ? 'ghost' : 'outline'} size="sm" className={compact ? 'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground' : ''}><MessageSquareHeart />{feedback ? 'Update feedback' : 'Share feedback'}</Button></DialogTrigger>
    <DialogContent className="max-h-[90svh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg">
      <DialogHeader><p className="mb-2 text-xs font-semibold uppercase text-primary">A moment to reflect</p><DialogTitle>How has Atlas helped you?</DialogTitle><DialogDescription>Optional feedback · your personal workspace statistics</DialogDescription></DialogHeader>
      <form onSubmit={event => { event.preventDefault(); void submit(); }} className="space-y-5">
        <fieldset><legend className="mb-2 text-sm font-medium">How helpful is Atlas?</legend><div className="flex gap-2" role="radiogroup" aria-label="Helpfulness rating">{[1,2,3,4,5].map(value => <Button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} variant="ghost" size="icon" onClick={() => setRating(value)} className="size-11 text-primary"><Star className={`size-7 ${value <= rating ? 'fill-current' : ''}`} /></Button>)}</div></fieldset>
        <div className="space-y-2"><Label htmlFor="minutes-saved">Total time saved so far (minutes)</Label><Input id="minutes-saved" type="number" min="0" max="1000000" step="1" required value={minutes} onChange={event => setMinutes(event.target.value)} placeholder="e.g. 120" /></div>
        <div className="space-y-2"><Label htmlFor="feedback-note">What made the biggest difference? <span className="font-normal text-muted-foreground">(optional)</span></Label><Textarea id="feedback-note" maxLength={1000} rows={3} value={note} onChange={event => setNote(event.target.value)} placeholder="A clearer email, a calmer week…" /></div>
        <p className="text-xs text-muted-foreground">Time saved is your estimate, not an automatic measurement. Your feedback is saved privately for this browser’s workspace.</p>
        <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Not now</Button><Button disabled={saving || !rating} type="submit">{saving ? <Loader2 className="animate-spin" /> : <Check />}Save feedback</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}