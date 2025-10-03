import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Helper to build keys consistently
export function geoKey(serverId: string) {
  return `nearby:${serverId}`
}
export function heartbeatKey(serverId: string, userId: string) {
  return `nearby:${serverId}:user:${userId}`
}
