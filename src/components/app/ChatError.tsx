import { Link, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function ChatError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-lg space-y-4 p-6 text-center">
      <h1 className="text-xl font-semibold">Chat couldn’t open</h1>
      <p className="text-sm text-muted-foreground">Your other tools are still available. Try opening this conversation again.</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => { reset(); void router.invalidate(); }}>Try again</Button>
        <Button variant="outline" asChild><Link to="/">Back to dashboard</Link></Button>
      </div>
    </div>
  );
}