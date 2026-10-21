<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- AI calls run only in server routes (`src/routes/api/*`) via `src/lib/ai.server.ts`; prompt templates live in `src/lib/prompts.ts` so the UI can preview them. Why: keeps the AI key server-side and prompts structured in one place.
- Chat threads are stored in browser localStorage (`src/lib/threads.ts`), one URL per thread at `/chat/$threadId`. Why: user chose threaded, browser-saved history.
- Chat uses a shared validated external store with stable snapshots and a memoized per-thread transport; storage failures retain session state. Why: malformed or unavailable browser storage must not crash navigation or repeatedly render chat.
