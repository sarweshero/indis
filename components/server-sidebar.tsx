"use client"

import useSWR from "swr"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ServerSidebar({
  collapsed,
  onToggle,
  activeServerId,
  onSelectServer,
}: {
  collapsed: boolean
  onToggle: () => void
  activeServerId: string
  onSelectServer: (id: string) => void
}) {
  const { data, mutate } = useSWR<{ id: string; name: string; icon: string; unread: boolean; boosted?: boolean }[]>(
    "/api/mock/servers",
    fetcher,
  )

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  async function createServer() {
    if (!name.trim()) return
    const res = await fetch("/api/mock/servers", { method: "POST", body: JSON.stringify({ name }) })
    if (res.ok) {
      const s = await res.json()
      await mutate()
      onSelectServer(s.id)
      setName("")
      setOpen(false)
    }
  }

  return (
    <aside
      className={cn(
        "h-full border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-14" : "w-20 md:w-24",
      )}
    >
      <div className="flex h-12 items-center justify-between px-2">
        <Button size="icon" variant="secondary" onClick={onToggle} title="Toggle" className="neon-ring">
          {collapsed ? "›" : "‹"}
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="default" title="Create server" className="neon-ring">
              +
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create server</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input placeholder="Server name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <DialogFooter>
              <Button onClick={createServer}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <nav className="flex flex-col items-center gap-3 py-3">
        {data?.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectServer(s.id)}
            className={cn(
              "relative aspect-square w-10 md:w-12 rounded-xl transition-transform hover:scale-105 focus-visible:outline-none neon-ring",
              activeServerId === s.id ? "ring-2 ring-ring" : "opacity-90",
            )}
            aria-label={s.name}
            title={s.name}
          >
            <img
              src={"/placeholder.svg?height=80&width=80&query=server-" + s.name}
              alt={s.name + " server icon"}
              className="h-full w-full rounded-xl"
            />
            {s.unread && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary" aria-hidden />}
            {s.boosted && <span className="absolute inset-x-1 bottom-0 h-0.5 rounded bg-accent" aria-hidden />}
            {activeServerId === s.id && (
              <div className="absolute -bottom-2 right-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="secondary" className="h-6 px-2">
                      •••
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={async () => {
                        const newName = prompt("Rename server", s.name)?.trim()
                        if (!newName) return
                        const res = await fetch(`/api/mock/servers/${s.id}`, {
                          method: "PUT",
                          body: JSON.stringify({ name: newName }),
                        })
                        if (res.ok) await mutate()
                      }}
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={async () => {
                        if (!confirm(`Delete server "${s.name}"?`)) return
                        const res = await fetch(`/api/mock/servers/${s.id}`, { method: "DELETE" })
                        if (res.ok) {
                          await mutate()
                          const next = (data || []).find((x) => x.id !== s.id)?.id
                          if (next) onSelectServer(next)
                        }
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </button>
        ))}
      </nav>
    </aside>
  )
}
