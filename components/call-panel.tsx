"use client"

import { Button } from "@/components/ui/button"

export function CallPanel({
  mode,
  serverId,
  channelId,
}: {
  mode: "voice" | "video" | "stage" | "forum"
  serverId: string
  channelId: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="text-2xl font-semibold">{mode.toUpperCase()} CHANNEL</div>
      <div className="rounded-xl bg-card border border-border h-[50vh] w-[min(900px,90%)] flex items-center justify-center neon-ring">
        {mode === "voice" && (
          <span className="text-muted-foreground">
            Voice connected: {serverId}/{channelId}
          </span>
        )}
        {mode === "video" && <span className="text-muted-foreground">Video preview (mock)</span>}
        {mode === "stage" && <span className="text-muted-foreground">Stage: Speakers + Audience (mock)</span>}
        {mode === "forum" && <span className="text-muted-foreground">Forum threads list (mock)</span>}
      </div>
      <div className="flex gap-2">
        <Button variant="secondary">Mute</Button>
        <Button variant="secondary">Deafen</Button>
        <Button>Disconnect</Button>
      </div>
    </div>
  )
}
