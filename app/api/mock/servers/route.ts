import { servers, channelsByServer, rolesByServer, serverMembers, tasks, events } from "@/lib/mock-data"
import { slugify } from "@/lib/mock-data"

export async function GET() {
  return Response.json(servers)
}

export async function POST(req: Request) {
  const body = await req.json()
  const name: string = (body?.name || "").trim()
  const id: string = body?.id ? slugify(body.id) : slugify(name || "server")
  if (!name) return new Response(JSON.stringify({ error: "Name required" }), { status: 400 })

  if (servers.find((s) => s.id === id)) {
    return new Response(JSON.stringify({ error: "Server ID exists" }), { status: 409 })
  }

  const server = { id, name, icon: name[0]?.toUpperCase() || "S", unread: false }
  servers.push(server)

  channelsByServer[id] = {
    sections: [
      { title: "Text Channels", items: [{ id: "general", name: "general", icon: "#", unread: false }] },
      { title: "Voice Channels", items: [{ id: "lobby", name: "Lobby", icon: "🔊" }] },
    ],
  }
  rolesByServer[id] = [...(rolesByServer["valorant"] || [{ id: "Member", name: "Member" }])]
  serverMembers[id] = []
  ;(tasks as any)[id] = {
    columns: [
      { id: "todo", title: "To Do", items: [] },
      { id: "doing", title: "In Progress", items: [] },
      { id: "done", title: "Done", items: [] },
    ],
  }
  ;(events as any)[id] = []

  return Response.json(server, { status: 201 })
}
