import { rolesByServer } from "@/lib/mock-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const serverId = String(searchParams.get("server") || "")
  if (!serverId || !rolesByServer[serverId]) return new Response("Not found", { status: 404 })
  return Response.json(rolesByServer[serverId])
}

export async function POST(req: Request) {
  const body = await req.json()
  const serverId = String(body?.serverId || "")
  const name = String(body?.name || "").trim()
  const id = String(body?.id || name)
  if (!serverId || !name) return new Response(JSON.stringify({ error: "serverId and name required" }), { status: 400 })
  rolesByServer[serverId] = rolesByServer[serverId] || []
  if (rolesByServer[serverId].some((r) => r.id === id)) {
    return new Response(JSON.stringify({ error: "Role exists" }), { status: 409 })
  }
  const role = { id, name }
  rolesByServer[serverId].push(role)
  return Response.json(role, { status: 201 })
}
