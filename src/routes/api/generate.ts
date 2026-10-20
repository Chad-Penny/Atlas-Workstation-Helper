import { createFileRoute } from "@tanstack/react-router";
import { TOOL_PROMPTS, type ToolId } from "@/lib/prompts";
import { errorResponse, streamAI } from "@/lib/ai.server";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { tool: ToolId; fields: Record<string, string> };
          const tpl = TOOL_PROMPTS[body.tool];
          if (!tpl) return new Response(JSON.stringify({ error: "Unknown tool" }), { status: 400 });
          const { result } = streamAI(
            request,
            [{ role: "user", content: tpl.build(body.fields ?? {}) }],
            tpl.system,
          );
          return result.toTextStreamResponse();
        } catch (e) {
          return errorResponse(e);
        }
      },
    },
  },
});
