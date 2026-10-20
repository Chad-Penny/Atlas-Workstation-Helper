import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { ToolPage } from "@/components/app/ToolPage";

const t = "Smart Email Generator — Atlas Workplace AI";
const d = "Draft polished professional emails in seconds with the right tone.";
export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] }),
  component: () => (
    <ToolPage tool="email" title="Smart Email Generator" description={d} icon={<Mail />} required="purpose"
      fields={[
        { name: "recipient", label: "Recipient", type: "text", placeholder: "e.g. Sarah, Head of Procurement" },
        { name: "purpose", label: "Purpose", type: "text", placeholder: "e.g. Follow up on the Q3 proposal" },
        { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Concise"] },
        { name: "length", label: "Length", type: "select", options: ["Medium", "Short", "Long"] },
        { name: "points", label: "Key points", type: "textarea", placeholder: "- Pricing valid until Friday\n- Offer a call next week" },
      ]} />
  ),
});
