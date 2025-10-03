import { rolesByServer, serverMembers } from "@/lib/mock-data"

export async function PUT(req: Request, { params }: { params: { roleId: string } }) {
  const { searchParams } = new URL(req.url)
  const serverId = String(searchParams.get("server") || "")
  const body = await req.json()
  const name = String(body?.name || "").trim()
  if (!serverId || !name) return new Response(JSON.stringify({ error: "server and name required" }), { status: 400 })
  const roles = rolesByServer[serverId] || []
  const r = roles.find((x) => x.id === params.roleId)
  if (!r) return new Response("Not found", { status: 404 })
  r.name = name
  return Response.json(r)
}

export async function DELETE(req: Request, { params }: { params: { roleId: string } }) {
  const { searchParams } = new URL(req.url)
  const serverId = String(searchParams.get("server") || "")
  if (!serverId) return new Response(JSON.stringify({ error: "server required" }), { status: 400 })
  const roles = rolesByServer[serverId] || []
  const idx = roles.findIndex((x) => x.id === params.roleId)
  if (idx === -1) return new Response("Not found", { status: 404 })
  roles.splice(idx, 1)
  // Reassign members who had this role to "Member" if exists
  const fallback = roles.find((x) => x.id === "Member")?.id || (roles[0]?.id ?? "Member")
  const mem = serverMembers[serverId] || []
  mem.forEach((m) => {
    if (m.roleId === params.roleId) m.roleId = fallback
  })
  return Response.json({ ok: true })
}
