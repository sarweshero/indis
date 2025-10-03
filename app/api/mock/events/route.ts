import { events } from "@/lib/mock-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const server = searchParams.get("server") || "valorant"
  // server is a string; events is a keyed object — cast to any to satisfy TS
  return Response.json((events as any)[server] ?? [])
}
