"use client"

import { useState } from "react"
import { ServerSidebar } from "./server-sidebar"
import { ChannelSidebar } from "./channel-sidebar"
import { ChatPanel } from "./chat-panel"
import { RightPanel } from "./right-panel"
import { ThemeSwitcher } from "./theme-switcher"
import { Button } from "@/components/ui/button"

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeServerId, setActiveServerId] = useState("valorant")
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [rightTab, setRightTab] = useState<"members" | "tasks" | "notes" | "games" | "nearby">("members")

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

      {/* Right utilities */}
      <RightPanel serverId={activeServerId} tab={rightTab} onTabChange={setRightTab} />
    </div>
  )
}
