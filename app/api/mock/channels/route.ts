import { channelsByServer } from "@/lib/mock-data"
import { slugify } from "@/lib/mock-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const server = searchParams.get("server") || "valorant"
  return Response.json(channelsByServer[server] ?? { sections: [] })
}

export async function POST(req: Request) {
  const body = await req.json()
  const serverId = String(body?.serverId || "")
  const name = String(body?.name || "").trim()
  const id = body?.id ? slugify(body.id) : slugify(name)
  if (!serverId || !name) return new Response(JSON.stringify({ error: "serverId and name required" }), { status: 400 })
  const server = channelsByServer[serverId]
  if (!server) return new Response("Server not found", { status: 404 })

  const section = server.sections.find((s: any) => /text/i.test(s.title)) || server.sections[0]
  if (!section) return new Response("No sections", { status: 400 })

  if (section.items.some((c: any) => c.id === id)) {
    return new Response(JSON.stringify({ error: "Channel exists" }), { status: 409 })
  }

  const chan = { id, name, icon: "#", unread: false }
  section.items.push(chan)
  return Response.json(chan, { status: 201 })
}
