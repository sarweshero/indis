"use client"

import useSWR from "swr"
import { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { PollComposer } from "./poll-composer"
import { CallPanel } from "./call-panel"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Mode = "chat" | "voice" | "video" | "stage" | "forum"

export function ChatPanel({
  serverId,
  channelId,
}: {
  serverId: string
  channelId: string | null
}) {
  const [mode, setMode] = useState<Mode>("chat")
  const { data: messages } = useSWR(
    channelId ? `/api/mock/messages?server=${serverId}&channel=${channelId}` : null,
    fetcher,
  )
  const { data: users } = useSWR("/api/mock/users", fetcher)
  const [text, setText] = useState("")

  const endRef = useRef<HTMLDivElement | null>(null)

  const channelTitle = useMemo(() => (channelId ? `#${channelId}` : "Select a channel"), [channelId])

  return (
    <div className="flex h-[calc(100dvh-3rem)] flex-col">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        {["chat", "voice", "video", "stage", "forum"].map((m) => (
          <Button
            key={m}
            size="sm"
            variant={mode === m ? "default" : "secondary"}
            onClick={() => setMode(m as Mode)}
            className={mode === m ? "neon-ring" : ""}
          >
            {m.toUpperCase()}
          </Button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              const res = await fetch("/api/ai/summarize", {
                method: "POST",
                body: JSON.stringify({ messages }),
              })
              const json = await res.json()
              alert("Summary:\n" + json.summary)
            }}
          >
            Summarize
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              const res = await fetch("/api/ai/recommend", { method: "POST", body: JSON.stringify({ serverId }) })
              const json = await res.json()
              alert("Recommended channels:\n" + json.channels.join(", "))
            }}
          >
            Recommend
          </Button>
        </div>
      </div>

      {mode === "chat" && (
        <>
          <div className="px-4 py-2 text-sm text-muted-foreground">{channelTitle}</div>
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
            {messages?.map((m: any) => (
              <Card key={m.id} className="p-3 bg-card/80 border-border">
                <div className="flex items-start gap-3">
                  <img
                    src={"/placeholder.svg?height=40&width=40&query=" + m.user}
                    alt={m.user + " avatar"}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{m.user}</span>
                      <span className="text-xs text-muted-foreground">{m.time}</span>
                      {m.pinned && <span className="ml-2 rounded bg-accent/20 px-2 text-[10px]">Pinned</span>}
                      {m.status && <span className="ml-1 text-[10px] text-muted-foreground">{m.status}</span>}
                    </div>
                    <div className="mt-1 text-pretty">{m.text}</div>
                    {m.media && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {m.media.map((file: any, idx: number) => (
                          <img
                            key={idx}
                            src={"/placeholder.svg?height=240&width=420&query=" + encodeURIComponent(file.alt)}
                            alt={file.alt}
                            className="h-28 w-full rounded-md object-cover"
                          />
                        ))}
                      </div>
                    )}
                    {m.poll && <PollComposer initialPoll={m.poll} readOnly />}
                  </div>
                </div>
              </Card>
            ))}
            <div ref={endRef} />
          </div>
          <div className="border-t border-border p-3 flex items-center gap-2">
            <Input
              placeholder="Message #general — type @ to mention"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              onClick={async () => {
                if (!text.trim()) return
                const res = await fetch("/api/mock/messages", {
                  method: "POST",
                  body: JSON.stringify({ serverId, channelId, text }),
                })
                if (res.ok) setText("")
              }}
            >
              Send
            </Button>
          </div>
        </>
      )}

      {mode !== "chat" && <CallPanel mode={mode} serverId={serverId} channelId={channelId ?? ""} />}
    </div>
  )
}
