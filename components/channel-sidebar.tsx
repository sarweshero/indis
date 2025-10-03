"use client"

import useSWR from "swr"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { gravatarUrl } from '@/lib/gravatar'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ChannelSidebar({
  serverId,
  onSelectChannel,
}: {
  serverId: string
  onSelectChannel: (id: string) => void
}) {
  const { data, mutate } = useSWR(`/api/mock/channels?server=${serverId}`, fetcher)
  const { data: allUsers } = useSWR(`/api/mock/users`, fetcher)

  const [newChannel, setNewChannel] = useState("")

  async function addChannel() {
    const name = newChannel.trim()
    if (!name) return
    const res = await fetch("/api/mock/channels", { method: "POST", body: JSON.stringify({ serverId, name }) })
    if (res.ok) {
      await mutate()
      setNewChannel("")
    }
  }

  // Special layout for Direct Messages
  if (serverId === "dm") {
    return (
      <aside className={cn("hidden md:flex md:w-64 xl:w-72 h-full flex-col bg-sidebar border-r border-sidebar-border")}>
        <div className="p-3">
          <Input placeholder="Find or start a conversation" />
        </div>
        <div className="px-3 pb-2 text-xs font-semibold">Direct Messages</div>
        <nav className="px-2 pb-4 overflow-y-auto">
          <ul className="space-y-2">
            {(data?.sections?.[0]?.items ?? []).map((c: any) => {
              // channel id is 'dm-<userId>'
              const userId = String(c.id || '').replace(/^dm-/, '')
              const user = (allUsers ?? []).find((u: any) => u.id === userId)
              const avatar = user?.email ? gravatarUrl(user.email, 40) : "/placeholder.svg?height=40&width=40&query=" + c.name
              return (
                <li key={c.id}>
                  <button
                    onClick={() => onSelectChannel(c.id)}
                    className="w-full flex items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-sidebar-accent"
                  >
                    <img src={avatar} alt={c.name + " avatar"} className="h-9 w-9 rounded-full" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user?.status ?? '—'}</div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="mt-auto p-3">
          <div className="flex items-center gap-2">
            <img src={gravatarUrl('you@example.com', 36)} className="h-9 w-9 rounded-full" />
            <div className="text-sm">You</div>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className={cn("hidden md:flex md:w-64 xl:w-72 h-full flex-col bg-sidebar border-r border-sidebar-border")}>
      <div className="p-3 space-y-2">
        <Input placeholder="Search channels" />
        <div className="flex gap-2">
          <Input placeholder="New channel name" value={newChannel} onChange={(e) => setNewChannel(e.target.value)} />
          <Button onClick={addChannel}>Add</Button>
        </div>
      </div>
      <nav className="px-2 pb-4 overflow-y-auto">
        {data?.sections?.map((sec: any) => (
          <div key={sec.title} className="mb-3">
            <div className="px-2 text-xs uppercase tracking-wide text-muted-foreground">{sec.title}</div>
            <ul className="mt-2 space-y-1">
              {sec.items.map((c: any) => (
                <li key={c.id} className="flex justify-between">
                  <button
                    onClick={() => onSelectChannel(c.id)}
                    className="w-full rounded-md px-2 py-1.5 text-left hover:bg-sidebar-accent"
                  >
                    <span className="mr-2">{c.icon}</span>
                    <span className="align-middle">{c.name}</span>
                    {c.unread && <span className="ml-2 rounded bg-primary/20 px-1 text-[10px]">new</span>}
                  </button>
                  <div className="pl-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-6 px-2"
                      onClick={async () => {
                        if (!confirm(`Delete #${c.name}?`)) return
                        const res = await fetch(`/api/mock/channels/${c.id}?server=${serverId}`, { method: "DELETE" })
                        if (res.ok) await mutate()
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <Separator className="my-3" />
          </div>
        ))}
      </nav>
    </aside>
  )
}
