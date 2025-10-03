"use client"

import { useState, useEffect } from "react"
import { ServerSidebar } from "./server-sidebar"
import { ChannelSidebar } from "./channel-sidebar"
import { ChatPanel } from "./chat-panel"
import { RightPanel } from "./right-panel"
import { ThemeSwitcher } from "./theme-switcher"
import { Button } from "@/components/ui/button"

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  // Default to Direct Messages as the home view
  const [activeServerId, setActiveServerId] = useState("dm")
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [rightTab, setRightTab] = useState<"members" | "tasks" | "notes" | "games" | "nearby">("members")

  useEffect(() => {
    // If DMs are active and no channel selected, pick the first DM channel
    if (activeServerId === "dm" && !activeChannelId) {
      fetch(`/api/mock/channels?server=dm`)
        .then((r) => r.json())
        .then((json) => {
          const first = json?.sections?.[0]?.items?.[0]?.id
          if (first) setActiveChannelId(first)
        })
        .catch(() => {})
    }
  }, [activeServerId, activeChannelId])

  return (
    <div className="flex h-full bg-background">
      {/* Left rail: Servers */}
      <ServerSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        activeServerId={activeServerId}
        onSelectServer={setActiveServerId}
      />

      {/* Middle left: Channels/DMs */}
      <ChannelSidebar serverId={activeServerId} onSelectChannel={setActiveChannelId} />

      {/* Main: Chat/Calls */}
      <div className="flex-1 min-w-0 border-l border-r border-border">
        <div className="flex h-12 items-center justify-between px-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Server</span>
            <span className="text-pretty font-medium neon-text">{activeServerId}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button size="sm" variant="secondary" className="neon-ring">
              Go Live
            </Button>
          </div>
        </div>
        <ChatPanel serverId={activeServerId} channelId={activeChannelId} />
      </div>

      {/* Right utilities (hide on DM view) */}
      {activeServerId !== "dm" && <RightPanel serverId={activeServerId} tab={rightTab} onTabChange={setRightTab} />}
    </div>
  )
}
