"use client"

import useSWR from "swr"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { gravatarUrl } from '@/lib/gravatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function NearbyGamers({ serverId }: { serverId: string }) {
  const [me, setMe] = useState<string | null>(null)
  const [pos, setPos] = useState<{ lat: number; lon: number } | null>(null)
  const [radiusKm, setRadiusKm] = useState(10)
  const [sharing, setSharing] = useState(false)

  // Server members (to choose "I am")
  const { data: members } = useSWR(`/api/mock/users?server=${serverId}`, fetcher)

  // Build query for nearby list when we have pos
  const listUrl = useMemo(() => {
    if (!pos) return null
    const params = new URLSearchParams({
      server: serverId,
      lat: String(pos.lat),
      lon: String(pos.lon),
      radiusKm: String(radiusKm),
      ...(me ? { userId: me } : {}),
    })
    return `/api/nearby/list?${params.toString()}`
  }, [pos, serverId, radiusKm, me])

  const { data: nearby, mutate: refreshNearby } = useSWR(listUrl, fetcher, {
    refreshInterval: 15000, // refresh every 15s
  })

  const shareLocation = useCallback(() => {
    if (!me) return
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.")
      return
    }
    setSharing(true)
    navigator.geolocation.getCurrentPosition(
      async (g) => {
        const lat = g.coords.latitude
        const lon = g.coords.longitude
        setPos({ lat, lon })
        const res = await fetch("/api/nearby/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serverId, userId: me, lat, lon }),
        })
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          alert(j?.error || "Failed to share location")
        } else {
          // update nearby list immediately
          refreshNearby()
        }
        setSharing(false)
      },
      (err) => {
        alert(err.message || "Unable to get location")
        setSharing(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [me, serverId, refreshNearby])

  // If user changes, refresh immediately
  useEffect(() => {
    if (listUrl) refreshNearby()
  }, [listUrl, refreshNearby])

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-card p-3">
        <div className="text-sm font-semibold mb-2">Share your location</div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={me ?? ""} onValueChange={(v) => setMe(v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="I am…" />
            </SelectTrigger>
            <SelectContent>
              {(members ?? []).map((m: any) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={200}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Math.max(1, Math.min(200, Number(e.target.value) || 10)))}
              className="w-24"
              aria-label="Radius (km)"
            />
            <span className="text-sm text-muted-foreground">km</span>
          </div>
          <Button onClick={shareLocation} disabled={!me || sharing} className="neon-ring">
            {sharing ? "Sharing…" : "Share Location"}
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Location is only visible to members of this server and expires after 10 minutes of inactivity.
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-3">
        <div className="text-sm font-semibold mb-2">Nearby members</div>
        {!pos && <div className="text-sm text-muted-foreground">Share your location to find nearby gamers.</div>}
        {pos && (
          <ul className="space-y-2">
            {(nearby?.nearby ?? []).length === 0 && (
              <li className="text-sm text-muted-foreground">No nearby members within {radiusKm} km.</li>
            )}
            {(nearby?.nearby ?? []).map((n: any) => (
              <li key={n.id} className="flex items-center gap-3">
                <img
                  src={
                    (members ?? []).find((u: any) => u.name === n.name)?.email
                      ? gravatarUrl((members ?? []).find((u: any) => u.name === n.name).email, 32)
                      : "/placeholder.svg?height=32&width=32&query=" + n.name
                  }
                  alt={n.name + " avatar"}
                  className="h-8 w-8 rounded-full"
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium">{n.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {n.distKm.toFixed ? n.distKm.toFixed(2) : Number(n.distKm).toFixed(2)} km away • {n.status || "—"}
                  </div>
                </div>
                <div className="ml-auto">
                  <Button size="sm" variant="secondary">
                    Connect
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
