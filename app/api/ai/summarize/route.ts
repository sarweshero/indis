import { safeGenerateText } from "@/lib/ai-safe"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lines: string[] = (messages ?? []).map((m: any) => `${m.user}: ${m.text}`)
  const text = lines.join("\n")

  // naive local fallback summary (last few messages and participants)
  const last = lines.slice(-3)
  const participants = Array.from(new Set((messages ?? []).map((m: any) => m.user))).slice(0, 5)
  const fallbackSummary =
    `• Recent messages: ${last.join(" | ").slice(0, 220)}\n` +
    `• Active participants: ${participants.join(", ")}\n` +
    `• Topic: gaming coordination, chat in progress\n` +
    `• Tip: use threads for sub-topics`

  const { text: summary, fallback } = await safeGenerateText({
    // prefer xai/grok-4 per integration guidelines; will still fallback if billing is missing
    model: "xai/grok-4",
    prompt: `Summarize this gaming chat for quick catch-up in 4 bullet points:\n${text}`,
    maxOutputTokens: 300,
    temperature: 0.4,
    fallbackText: fallbackSummary,
  })

  return Response.json({ summary, aiFallback: fallback })
}
