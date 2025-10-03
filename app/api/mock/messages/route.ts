import { messages } from "@/lib/mock-data"

export async function GET(req: Request) {
  // In real app, filter by server/channel. Here we return shared mock.
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
  }
  messages.push(newMsg)
  return Response.json({ ok: true, message: newMsg })
}
