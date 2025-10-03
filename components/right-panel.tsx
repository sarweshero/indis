"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import useSWR from "swr"
import { TaskBoard } from "./task-board"
import { EventCalendar } from "./event-calendar"
import { MiniGames } from "./mini-games"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { gravatarUrl } from '@/lib/gravatar'
import { useState } from "react"
import { NearbyGamers } from "./nearby-gamers"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function RightPanel({
  serverId,
  tab,
  onTabChange,
}: {
  serverId: string
  tab: "members" | "tasks" | "notes" | "games" | "nearby"
  onTabChange: (t: "members" | "tasks" | "notes" | "games" | "nearby") => void
}) {
  const { data: members, mutate: mutateMembers } = useSWR(`/api/mock/users?server=${serverId}`, fetcher)
  const { data: roles, mutate: mutateRoles } = useSWR(`/api/mock/roles?server=${serverId}`, fetcher)
  const { data: allUsers } = useSWR(`/api/mock/users`, fetcher)

  const [roleName, setRoleName] = useState("")
  const [addUserId, setAddUserId] = useState<string | null>(null)

  async function createRole() {
    if (!roleName.trim()) return
    const res = await fetch("/api/mock/roles", { method: "POST", body: JSON.stringify({ serverId, name: roleName }) })
    if (res.ok) {
      await mutateRoles()
      setRoleName("")
    }
  }

  async function addMember() {
    if (!addUserId) return
    const res = await fetch("/api/mock/users", {
      method: "POST",
      body: JSON.stringify({ serverId, userId: addUserId, roleId: "Member" }),
    })
    if (res.ok) {
      await mutateMembers()
      setAddUserId(null)
    }
  }

  return (
    <aside className="hidden lg:flex w-[22rem] h-full flex-col bg-sidebar border-l border-sidebar-border">
      <Tabs value={tab} onValueChange={(v) => onTabChange(v as any)} className="flex-1 flex flex-col">
        <div className="border-b border-border p-2">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="members" className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            <div className="rounded-md border border-border p-3 bg-card">
              <div className="text-sm font-semibold mb-2">Roles</div>
              <div className="flex gap-2">
                <Input placeholder="New role name" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                <Button onClick={createRole}>Add Role</Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Existing: {(roles ?? []).map((r: any) => r.name).join(", ") || "—"}
              </div>
            </div>

            <div className="rounded-md border border-border p-3 bg-card">
              <div className="text-sm font-semibold mb-2">Add Member</div>
              <div className="flex gap-2 items-center">
                <Select value={addUserId ?? ""} onValueChange={(v) => setAddUserId(v)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {(allUsers ?? [])
                      .filter((u: any) => !(members ?? []).some((m: any) => m.id === u.id))
                      .map((u: any) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button onClick={addMember}>Add</Button>
              </div>
            </div>

            <ul className="space-y-2">
              {members?.map((m: any) => (
                <li key={m.id} className="flex items-center gap-2">
                  <img
                    src={
                      // members here are from serverMembers mapping; find user email
                      (allUsers ?? []).find((u: any) => u.name === m.name)?.email
                        ? gravatarUrl((allUsers ?? []).find((u: any) => u.name === m.name).email, 32)
                        : "/placeholder.svg?height=32&width=32&query=" + m.name
                    }
                    alt={m.name + " avatar"}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.status}</div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Select
                      value={m.role}
                      onValueChange={async (roleId) => {
                        const res = await fetch("/api/mock/users", {
                          method: "PUT",
                          body: JSON.stringify({ serverId, userId: m.id, roleId }),
                        })
                        if (res.ok) await mutateMembers()
                      }}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(roles ?? []).map((r: any) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="flex-1 overflow-y-auto p-3">
          <TaskBoard serverId={serverId} />
        </TabsContent>

        <TabsContent value="notes" className="flex-1 overflow-y-auto p-3">
          <textarea
            className="w-full h-[calc(100%-0.5rem)] rounded-md bg-card p-3"
            placeholder="Shared notes…"
            defaultValue="- Scrim Thursday 8pm\n- Patch notes to review\n- Update roles + permissions"
          />
        </TabsContent>

        <TabsContent value="games" className="flex-1 overflow-y-auto p-3">
          <MiniGames />
          <div className="mt-4">
            <EventCalendar serverId={serverId} />
          </div>
        </TabsContent>

        <TabsContent value="nearby" className="flex-1 overflow-y-auto p-3">
          <NearbyGamers serverId={serverId} />
        </TabsContent>
      </Tabs>
    </aside>
  )
}
