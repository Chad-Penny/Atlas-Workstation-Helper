import { describe, expect, it } from 'vitest';
import { completedGeneration, feedbackSchema, parseCounts } from '@/lib/workspace-stats';

describe('workspace activity and feedback', () => {
  it('accepts five stars but rejects ratings above the user’s five-star maximum', () => {
    expect(feedbackSchema.safeParse({ rating: 5, minutesSaved: 120, note: '' }).success).toBe(true);
    expect(feedbackSchema.safeParse({ rating: 6, minutesSaved: 120, note: '' }).success).toBe(false);
  });
  it('preserves the self-reported time saved and rejects negative time', () => {
    expect(feedbackSchema.parse({ rating: 4, minutesSaved: 120, note: '' }).minutesSaved).toBe(120);
    expect(feedbackSchema.safeParse({ rating: 4, minutesSaved: -1, note: '' }).success).toBe(false);
  });
  it('counts only completed nonempty tool outputs, not empty or stopped generations', () => {
    expect(completedGeneration('email', 'Draft email', true)).toEqual(['email']);
    expect(completedGeneration('meeting', ' ', true)).toEqual([]);
    expect(completedGeneration('tasks', 'Partial plan', false)).toEqual([]);
  });
  it('keeps each actual activity total separate and defaults missing values to zero', () => {
    expect(parseCounts({ prompt: 7, email: 3, meeting: 2, tasks: 1, research: 1, conversation: 4 })).toEqual({ prompt: 7, email: 3, meeting: 2, tasks: 1, research: 1, conversation: 4 });
    expect(parseCounts({ prompt: -2 }).prompt).toBe(0);
  });
});