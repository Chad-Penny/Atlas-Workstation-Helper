import { ShieldCheck } from "lucide-react";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex gap-2.5 rounded-lg border border-highlight/40 bg-highlight/10 p-3 text-xs text-foreground/80">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-highlight-foreground" />
      <p>
        <strong>Responsible AI:</strong> Content is AI-generated and may contain errors or bias. Review,
        fact-check and edit before sharing.
        {!compact && " Don't enter confidential, personal or regulated data. You remain accountable for decisions made using this output."}
      </p>
    </div>
  );
}
