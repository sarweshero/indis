import { users, serverMembers, rolesByServer } from "@/lib/mock-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const serverId = searchParams.get("server")
  if (!serverId) return Response.json(users)

  const roles = rolesByServer[serverId] || []
  const mem = serverMembers[serverId] || []
  const byId = Object.fromEntries(users.map((u) => [u.id, u]))
  const withRoles = mem.map((m) => {
    const u = byId[m.userId]
    const role = roles.find((r) => r.id === m.roleId)?.name || m.roleId || "Member"
    return { id: u.id, name: u.name, status: u.status, role }
  })
  return Response.json(withRoles)
}

export async function POST(req: Request) {
  // add member to server: { serverId, userId, roleId? }
  const body = await req.json()
  const serverId = String(body?.serverId || "")
  const userId = String(body?.userId || "")
  const roleId = String(body?.roleId || "Member")
  if (!serverId || !userId)
    return new Response(JSON.stringify({ error: "serverId and userId required" }), { status: 400 })
  serverMembers[serverId] = serverMembers[serverId] || []
  if (serverMembers[serverId].some((m) => m.userId === userId)) {
    return new Response(JSON.stringify({ error: "Already a member" }), { status: 409 })
  }
  serverMembers[serverId].push({ userId, roleId })
  return Response.json({ ok: true })
}

export async function PUT(req: Request) {
  // assign role: { serverId, userId, roleId }
  const body = await req.json()
  const serverId = String(body?.serverId || "")
  const userId = String(body?.userId || "")
  const roleId = String(body?.roleId || "")
  if (!serverId || !userId || !roleId) {
    return new Response(JSON.stringify({ error: "serverId, userId, roleId required" }), { status: 400 })
  }
  const mem = serverMembers[serverId] || []
  const m = mem.find((x) => x.userId === userId)
  if (!m) return new Response("Not found", { status: 404 })
  m.roleId = roleId
  return Response.json({ ok: true })
}
