import { useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Eye, Pencil, RotateCcw, Square, Wand2, FileCode2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TOOL_PROMPTS, type ToolId } from "@/lib/prompts";
import { Disclaimer } from "./Disclaimer";
import { useWorkspaceStats } from './WorkspaceStatsProvider';
import { completedGeneration } from '@/lib/workspace-stats';

export type Field =
  | { name: string; label: string; type: "text"; placeholder?: string }
  | { name: string; label: string; type: "textarea"; placeholder?: string; rows?: number }
  | { name: string; label: string; type: "select"; options: string[] };

export function ToolPage({
  tool, title, description, icon, fields, required,
}: {
  tool: ToolId; title: string; description: string; icon: ReactNode; fields: Field[]; required: string;
}) {
  const init = Object.fromEntries(fields.map((f) => [f.name, f.type === "select" ? (f.options[0] ?? "") : ""]));
  const [values, setValues] = useState<Record<string, string>>(init);
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [showPrompt, setShowPrompt] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const { record } = useWorkspaceStats();

  async function run() {
    if (!values[required]?.trim()) { toast.error("Please fill in the required field first."); return; }
    const ctrl = new AbortController();
    abort.current = ctrl;
    setBusy(true); setOutput(""); setMode("preview");
    record('prompt');
    let generated = '';
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, fields: values }), signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Generation failed");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        generated += dec.decode(value, { stream: true });
        setOutput(generated);
      }
      generated += dec.decode();
      setOutput(generated);
      for (const kind of completedGeneration(tool, generated, !ctrl.signal.aborted)) record(kind);
    } catch (e) {
      if ((e as Error).name !== "AbortError") toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">{icon}</div>
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section className="min-w-0 space-y-4 rounded-2xl border bg-card p-5 shadow-soft">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>{f.label}{f.name === required && <span className="text-destructive"> *</span>}</Label>
              {f.type === "text" && (
                <Input id={f.name} placeholder={f.placeholder} value={values[f.name]}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
              )}
              {f.type === "textarea" && (
                <Textarea id={f.name} rows={f.rows ?? 4} placeholder={f.placeholder} value={values[f.name]}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
              )}
              {f.type === "select" && (
                <Select value={values[f.name] ?? ""} onValueChange={(v) => setValues({ ...values, [f.name]: v })}>
                  <SelectTrigger id={f.name}><SelectValue /></SelectTrigger>
                  <SelectContent>{f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              )}
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-1">
            {busy ? (
              <Button variant="secondary" onClick={() => abort.current?.abort()}><Square /> Stop</Button>
            ) : (
              <Button onClick={run}><Wand2 /> Generate</Button>
            )}
            <Button variant="ghost" onClick={() => setShowPrompt((s) => !s)}><FileCode2 /> {showPrompt ? "Hide" : "View"} prompt</Button>
          </div>
          {showPrompt && (
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              {TOOL_PROMPTS[tool].build(values as never)}
            </pre>
          )}
        </section>

        <section className="flex min-h-[420px] min-w-0 flex-col rounded-2xl border bg-card shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
            <p className="text-sm font-medium">Output {busy && <span className="ml-1 animate-pulse text-primary">· generating…</span>}</p>
            <div className="flex gap-1">
              <Button size="sm" variant={mode === "preview" ? "secondary" : "ghost"} onClick={() => setMode("preview")} disabled={!output}><Eye /> Preview</Button>
              <Button size="sm" variant={mode === "edit" ? "secondary" : "ghost"} onClick={() => setMode("edit")} disabled={!output || busy}><Pencil /> Edit</Button>
              <Button size="sm" variant="ghost" disabled={!output} aria-label="Copy output" title="Copy output" onClick={async () => { try { await navigator.clipboard.writeText(output); toast.success("Copied"); } catch { toast.error("Copy unavailable. Select and copy the output manually."); } }}><Copy /></Button>
              <Button size="sm" variant="ghost" disabled={!output || busy} onClick={run} aria-label="Regenerate"><RotateCcw /></Button>
            </div>
          </div>
          <div className="flex-1 p-4">
            {!output && !busy && (
              <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                Fill in the form and click Generate.<br />You can edit the result afterwards.
              </div>
            )}
            {mode === "edit" ? (
              <Textarea className="h-full min-h-[360px] font-mono text-sm" value={output} onChange={(e) => setOutput(e.target.value)} />
            ) : (
              output && <div className="prose-ai"><ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown></div>
            )}
          </div>
          <div className="border-t p-3"><Disclaimer compact /></div>
        </section>
      </div>
    </div>
  );
}
