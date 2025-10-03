"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export function EventCalendar({ serverId }: { serverId: string }) {
  const { data } = useSWR(`/api/mock/events?server=${serverId}`, fetcher)

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">Upcoming Events</div>
      {data?.map((e: any) => (
        <Card key={e.id} className="p-3 bg-card/80">
          <div className="font-medium">{e.title}</div>
          <div className="text-xs text-muted-foreground">
            {e.when} • {e.location}
          </div>
        </Card>
      ))}
    </div>
  )
}
