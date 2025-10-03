import { events } from "@/lib/mock-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const server = searchParams.get("server") || "valorant"
  return Response.json(events[server] ?? [])
}
