import { redis, geoKey, heartbeatKey } from "@/lib/redis"
import { serverMembers } from "@/lib/mock-data"

export async function POST(req: Request) {
  try {
    const { serverId, userId, lat, lon } = await req.json()

    if (!serverId || !userId || typeof lat !== "number" || typeof lon !== "number") {
      return new Response(JSON.stringify({ error: "serverId, userId, lat, lon required" }), { status: 400 })
    }

    // Only allow users who are members of the server to publish location
    const members = serverMembers[serverId] || []
    if (!members.some((m) => m.userId === userId)) {
      return new Response(JSON.stringify({ error: "User not a member of this server" }), { status: 403 })
    }

    // Store/update geo position
    await redis.geoadd(geoKey(serverId), { member: userId, longitude: lon, latitude: lat })

    // Heartbeat to mark active presence; expire after 10 minutes
    await redis.set(heartbeatKey(serverId, userId), "1", { ex: 600 })

    return Response.json({ ok: true })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Failed to update location" }), { status: 500 })
  }
}
