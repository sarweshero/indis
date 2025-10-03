import { messages, users } from "@/lib/mock-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const channel = String(searchParams.get("channel") || "")
  // If requesting a DM channel (dm-<userId>), return a small generated thread between You and that user
  if (channel.startsWith("dm-")) {
    const userId = channel.slice(3)
    const u = users.find((x: any) => x.id === userId)
    const thread = [
      { id: "m-dm-1", user: u?.name || "Unknown", time: "09:00", text: `Hey, this is ${u?.name}.` },
      { id: "m-dm-2", user: "You", time: "09:02", text: "Hey! What's up?" },
    ]
    return Response.json(thread)
  }

  // Default: return shared mock messages
  return Response.json(messages)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { text } = body
  const newMsg = {
    id: "m" + Math.random().toString(36).slice(2),
    user: "You",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    text,
    // allow media array: [{ alt, url?, type? }]
    media: Array.isArray(body.media) ? body.media : undefined,
  }
  messages.push(newMsg)
  return Response.json({ ok: true, message: newMsg })
}
