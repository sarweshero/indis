import { safeGenerateObject } from "@/lib/ai-safe"
import { z } from "zod"

const recSchema = z.object({
  channels: z.array(z.string()).max(5),
  servers: z.array(z.string()).max(3).optional(),
  rationale: z.string().optional(),
})

function fallbackRecs(serverId: string) {
  const base = (serverId || "lobby").toLowerCase()
  const byGame = base.includes("valorant")
    ? ["announcements", "ranked-lfg", "scrims", "vod-reviews", "agents-meta"]
    : base.includes("rpg")
      ? ["lore-library", "builds", "trade-post", "party-finder", "screenshots"]
      : ["general", "lfg", "clips", "events", "support"]

  const servers = base.includes("valorant")
    ? ["E-Sports-Arena", "Aim-Lab-Dojo", "Tactical-5Stack"]
    : base.includes("rpg")
      ? ["RPG-Guild", "Loot-Crafters", "Quest-Hub"]
      : ["Gaming-Hub", "Co-Op-Arcade", "Chill-Corner"]

  return {
    channels: byGame.slice(0, 5),
    servers: servers.slice(0, 3),
    rationale: "Based on server name and genre heuristics.",
  }
}

export async function POST(req: Request) {
  const { serverId } = await req.json()

  const { object, fallback } = await safeGenerateObject({
    model: "xai/grok-4",
    schema: recSchema,
    prompt: `Given this server "${serverId}", suggest up to 5 channels and up to 3 servers a gamer may like. Return only short slugs.`,
    maxOutputTokens: 200,
    fallbackObject: fallbackRecs(String(serverId || "")),
  })

  return Response.json({ ...object, aiFallback: fallback })
}
