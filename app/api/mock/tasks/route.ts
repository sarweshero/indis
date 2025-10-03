import { tasks } from "@/lib/mock-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const server = searchParams.get("server") || "valorant"
  return Response.json((tasks as any)[server] ?? { columns: [] })
}
