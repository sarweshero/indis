import { channelsByServer } from "@/lib/mock-data"

function findChannel(serverId: string, channelId: string) {
  const server = channelsByServer[serverId]
  if (!server) return null
  for (const sec of server.sections) {
    const idx = sec.items.findIndex((c: any) => c.id === channelId)
    if (idx !== -1) return { section: sec, index: idx }
  }
  return null
}

export async function PUT(req: Request, { params }: { params: { channelId: string } }) {
  const { searchParams } = new URL(req.url)
  const serverId = String(searchParams.get("server") || "")
  const body = await req.json()
  const name = String(body?.name || "").trim()
  if (!serverId || !name) return new Response(JSON.stringify({ error: "server and name required" }), { status: 400 })
  const found = findChannel(serverId, params.channelId)
  if (!found) return new Response("Not found", { status: 404 })
  found.section.items[found.index].name = name
  return Response.json(found.section.items[found.index])
}

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
  const { searchParams } = new URL(req.url)
  const serverId = String(searchParams.get("server") || "")
  if (!serverId) return new Response(JSON.stringify({ error: "server required" }), { status: 400 })
  const found = findChannel(serverId, params.channelId)
  if (!found) return new Response("Not found", { status: 404 })
  found.section.items.splice(found.index, 1)
  return Response.json({ ok: true })
}
