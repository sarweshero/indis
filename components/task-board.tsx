"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function TaskBoard({ serverId }: { serverId: string }) {
  const { data } = useSWR(`/api/mock/tasks?server=${serverId}`, fetcher)

  const cols = data?.columns ?? [
    { id: "todo", title: "To Do", items: [] },
    { id: "doing", title: "In Progress", items: [] },
    { id: "done", title: "Done", items: [] },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {cols.map((col: any) => (
        <div key={col.id} className="rounded-lg bg-card p-2 border border-border">
          <div className="mb-2 text-sm font-semibold">{col.title}</div>
          <div className="space-y-2">
            {col.items.map((t: any) => (
              <Card key={t.id} className="p-2 bg-card/80">
                <div className="text-sm font-medium">{t.title}</div>
                <div className="text-xs text-muted-foreground">
                  {t.assignee} • {t.due}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
