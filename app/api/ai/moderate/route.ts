import { safeGenerateObject } from "@/lib/ai-safe"
import { z } from "zod"

const modSchema = z.object({
  safe: z.boolean(),
  categories: z.object({
    harassment: z.boolean(),
    hate: z.boolean(),
    sexual: z.boolean(),
    selfHarm: z.boolean(),
    spam: z.boolean(),
  }),
  notes: z.string().optional(),
})

function heuristicModeration(text: string) {
  const lower = (text || "").toLowerCase()
  const has = (re: RegExp) => re.test(lower)
  const harassment = has(/\b(stupid|idiot|kys|kill yourself|loser|trash|report you)\b/i)
  const hate = has(/\b(slur1|slur2|racist|nazi|kkk)\b/i) // placeholder slurs, do not ship real slur lists
  const sexual = has(/\b(nsfw|nude|explicit)\b/i)
  const selfHarm = has(/\b(self harm|suicide|cutting)\b/i)
  const spam = has(/(http|https):\/\/\S{10,}.*(free|crypto|win|giveaway)/i) || (text || "").length > 2000

  const safe = !(harassment || hate || sexual || selfHarm || spam)
  return {
    safe,
    categories: { harassment, hate, sexual, selfHarm, spam },
    notes: safe ? "Heuristic pass" : "Heuristic flagged content",
  }
}

export async function POST(req: Request) {
  const { text } = await req.json()

  const fallback = heuristicModeration(text || "")

  const { object, fallback: aiFallback } = await safeGenerateObject({
    model: "xai/grok-4",
    schema: modSchema,
    prompt:
      `Moderate the following content for a gaming chat. Be strict with slurs and doxxing. ` +
      `Respond with booleans only and a short note.\n\n${text}`,
    maxOutputTokens: 200,
    fallbackObject: fallback,
  })

  return Response.json({ ...object, aiFallback })
}
