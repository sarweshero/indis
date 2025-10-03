import { servers, channelsByServer, rolesByServer, serverMembers, tasks, events } from "@/lib/mock-data"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const s = servers.find((v) => v.id === params.id)
  if (!s) return new Response("Not found", { status: 404 })
  return Response.json(s)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const idx = servers.findIndex((v) => v.id === params.id)
  if (idx === -1) return new Response("Not found", { status: 404 })
  const body = await req.json()
  const name = String(body?.name || "").trim()
  if (!name) return new Response(JSON.stringify({ error: "Name required" }), { status: 400 })
  servers[idx].name = name
  return Response.json(servers[idx])
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const idx = servers.findIndex((v) => v.id === params.id)
  if (idx === -1) return new Response("Not found", { status: 404 })
  const id = params.id
  servers.splice(idx, 1)
  delete channelsByServer[id]
  delete rolesByServer[id]
  delete serverMembers[id]
  delete (tasks as any)[id]
  delete (events as any)[id]
  return Response.json({ ok: true })
}
