import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { errorResponse, streamAI } from "@/lib/ai.server";
import { withLovableAiGatewayRunIdHeader } from "@/lib/run-id.server";

const SYSTEM =
  "You are Atlas, a friendly workplace productivity assistant. Help with emails, planning, meetings, research and general work questions. Use concise Markdown. Be honest about uncertainty and never fabricate facts.";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages: UIMessage[] };
          if (!Array.isArray(messages)) return new Response("Bad request", { status: 400 });
          const { result, runIdFetch } = streamAI(request, await convertToModelMessages(messages), SYSTEM);
          return withLovableAiGatewayRunIdHeader(
            result.toUIMessageStreamResponse({ originalMessages: messages, sendReasoning: true }),
            runIdFetch,
          );
        } catch (e) {
          return errorResponse(e);
        }
      },
    },
  },
});
