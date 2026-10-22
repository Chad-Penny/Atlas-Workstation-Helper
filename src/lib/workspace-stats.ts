import { z } from 'zod';

export const activityKinds = ['prompt', 'email', 'meeting', 'tasks', 'research', 'conversation'] as const;
export type ActivityKind = typeof activityKinds[number];
export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  minutesSaved: z.number().int().min(0).max(1000000),
  note: z.string().trim().max(1000),
});
export type Feedback = z.infer<typeof feedbackSchema>;
export type Counts = Record<ActivityKind, number>;
export const emptyCounts: Counts = { prompt: 0, email: 0, meeting: 0, tasks: 0, research: 0, conversation: 0 };
export function parseCounts(value: unknown): Counts {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return Object.fromEntries(activityKinds.map(kind => [kind, typeof record[kind] === 'number' && Number.isSafeInteger(record[kind]) && Number(record[kind]) >= 0 ? record[kind] : 0])) as Counts;
}
export function completedGeneration(kind: Exclude<ActivityKind, 'prompt' | 'conversation'>, output: string, completed: boolean): ActivityKind[] {
  return completed && output.trim() ? [kind] : [];
}