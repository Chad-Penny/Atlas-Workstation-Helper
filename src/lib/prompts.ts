// Structured prompt templates. Shared so the UI can preview the prompt it sends.
export type ToolId = "email" | "meeting" | "tasks" | "research";
type Fields = Record<string, string>;

const BASE =
  "You are a professional workplace productivity assistant. Write clear, accurate, well-structured Markdown. Never invent facts, names, numbers or dates that were not provided; flag assumptions explicitly.";

export const TOOL_PROMPTS: Record<ToolId, { system: string; build: (f: Fields) => string }> = {
  email: {
    system: `${BASE} You draft business emails.`,
    build: (f) => `## Task
Write a professional email.

## Context
- Recipient: ${f.recipient || "not specified"}
- Purpose: ${f.purpose || "not specified"}
- Tone: ${f.tone || "Professional"}
- Length: ${f.length || "Medium"}
- Key points to include:
${f.points || "none"}

## Output format
**Subject:** <subject line>

<email body with greeting and sign-off. Use [Your Name] as placeholder.>`,
  },
  meeting: {
    system: `${BASE} You summarize meeting notes and transcripts.`,
    build: (f) => `## Task
Summarize the meeting below.

## Meeting
- Title: ${f.title || "Untitled meeting"}
- Focus: ${f.focus || "Balanced overview"}

## Raw notes / transcript
${f.notes || ""}

## Output format
### Summary (3-5 sentences)
### Key decisions (bullets)
### Action items (table: Owner | Task | Due — use "TBD" if unknown)
### Open questions`,
  },
  tasks: {
    system: `${BASE} You plan work and prioritize tasks.`,
    build: (f) => `## Task
Create a prioritized, realistic work plan.

## Inputs
- Goal: ${f.goal || "not specified"}
- Timeframe: ${f.timeframe || "This week"}
- Available hours per day: ${f.hours || "not specified"}
- Tasks / to-dos:
${f.tasks || "none"}

## Output format
### Priorities (Eisenhower: Urgent/Important classification for each task)
### Schedule (table: Day | Time block | Task | Est. time)
### Risks & tips (max 4 bullets)`,
  },
  research: {
    system: `${BASE} You are a research analyst. Be balanced and note uncertainty. You cannot browse the web; say when information may be outdated and recommend verifying sources.`,
    build: (f) => `## Task
Research briefing on: ${f.topic || "not specified"}

## Parameters
- Audience: ${f.audience || "Business professionals"}
- Depth: ${f.depth || "Overview"}
- Specific questions:
${f.questions || "none"}

## Output format
### Executive summary
### Key findings (bullets)
### Considerations & trade-offs
### Suggested next steps
### What to verify (claims that need checking with primary sources)`,
  },
};
