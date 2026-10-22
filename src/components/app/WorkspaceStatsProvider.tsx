import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { emptyCounts, feedbackSchema, parseCounts, type ActivityKind, type Counts, type Feedback } from '@/lib/workspace-stats';

type StatsContext = { counts: Counts; feedback: Feedback | null; loading: boolean; error: string | null; record: (kind: ActivityKind) => void; submitFeedback: (value: Feedback) => Promise<void>; refresh: () => void };
const Context = createContext<StatsContext | null>(null);
const KEY = 'atlas-workspace-capability';
let sessionToken: string | null = null;
function workspaceToken() {
  if (sessionToken) return sessionToken;
  try { const saved = localStorage.getItem(KEY); if (saved && /^[a-f0-9]{64}$/.test(saved)) sessionToken = saved; } catch { /* Session-only identity if storage is blocked. */ }
  if (!sessionToken) {
    sessionToken = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
    try { localStorage.setItem(KEY, sessionToken); } catch { /* Keep session identity. */ }
  }
  return sessionToken;
}

export function WorkspaceStatsProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<Counts>(emptyCounts);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queue = useRef(Promise.resolve());
  const refresh = useCallback(async () => {
    const { data, error: failure } = await supabase.rpc('workspace_snapshot', { p_token: workspaceToken() });
    setLoading(false);
    if (failure) { setError('Statistics are temporarily unavailable.'); return; }
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      setCounts(parseCounts(data['counts']));
      const parsed = feedbackSchema.safeParse(data['feedback']);
      setFeedback(parsed.success ? parsed.data : null);
    }
    setError(null);
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const record = useCallback((kind: ActivityKind) => {
    const eventId = crypto.randomUUID();
    queue.current = queue.current.then(async () => {
      const { error: failure } = await supabase.rpc('workspace_record', { p_token: workspaceToken(), p_event_id: eventId, p_kind: kind });
      if (failure) { setError('Some activity could not be saved.'); return; }
      await refresh();
    }).catch(() => { setError('Some activity could not be saved.'); });
  }, [refresh]);
  const submitFeedback = useCallback(async (value: Feedback) => {
    const valid = feedbackSchema.parse(value);
    const { error: failure } = await supabase.rpc('workspace_submit_feedback', { p_token: workspaceToken(), p_rating: valid.rating, p_minutes: valid.minutesSaved, p_note: valid.note });
    if (failure) throw new Error('Your feedback could not be saved. Please try again.');
    await refresh();
  }, [refresh]);
  return <Context.Provider value={{ counts, feedback, loading, error, record, submitFeedback, refresh }}>{children}</Context.Provider>;
}
export function useWorkspaceStats() {
  const context = useContext(Context);
  if (!context) throw new Error('Workspace statistics require their provider');
  return context;
}