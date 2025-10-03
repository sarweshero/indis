import { redis, geoKey, heartbeatKey } from "@/lib/redis"
import { users, serverMembers } from "@/lib/mock-data"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const serverId = String(searchParams.get("server") || "")
    const lat = Number(searchParams.get("lat") || Number.NaN)
    const lon = Number(searchParams.get("lon") || Number.NaN)
    const excludeUserId = String(searchParams.get("userId") || "")
    const radiusKm = Number(searchParams.get("radiusKm") || 10)

    if (!serverId || Number.isNaN(lat) || Number.isNaN(lon)) {
      return new Response(JSON.stringify({ error: "server, lat, lon required" }), { status: 400 })
    }

    // Query within radius using Redis GEOSEARCH
    // @upstash/redis typings expect a different overload; cast to any to call with this shape.
    const results = await (redis as any).geosearch(geoKey(serverId), {
      byLonLat: { longitude: lon, latitude: lat },
      radius: radiusKm,
      unit: "km",
      withCoord: true,
      withDist: true,
      // Optionally limit results; comment out to get all
      count: 50,
    })

    // Shape: array of { member, distance, longitude, latitude } from @upstash/redis
    const membersSet = new Set((serverMembers[serverId] || []).map((m) => m.userId))
    const byId = Object.fromEntries(users.map((u) => [u.id, u]))

    // Filter: exclude self and non-members, and only include active heartbeats
    const filtered = []
    for (const item of results as any[]) {
      const memberId = String(item.member ?? "")
      if (!memberId || memberId === excludeUserId) continue
      if (!membersSet.has(memberId)) continue

      const alive = await redis.exists(heartbeatKey(serverId, memberId))
      if (!alive) continue

      const u = byId[memberId]
      filtered.push({
        id: memberId,
        name: u?.name ?? memberId,
        status: u?.status ?? "",
        distKm: typeof item.distance === "number" ? item.distance : Number(item.distance),
        coord: { lat: item.latitude, lon: item.longitude },
      })
    }

    // Sort by distance asc
    filtered.sort((a, b) => a.distKm - b.distKm)

    return Response.json({ nearby: filtered })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Failed to list nearby members" }), { status: 500 })
  }
}
