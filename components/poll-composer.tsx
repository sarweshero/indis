"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PollComposer({
  initialPoll,
  readOnly = false,
}: {
  initialPoll?: { question: string; options: { label: string; votes: number }[] }
  readOnly?: boolean
}) {
  const [poll, setPoll] = useState(
    initialPoll ?? {
      question: "Which map tonight?",
      options: [
        { label: "Ascent", votes: 3 },
        { label: "Bind", votes: 1 },
        { label: "Lotus", votes: 2 },
      ],
    },
  )

  return (
    <Card className="p-3 bg-card/70">
      <div className="font-medium">{poll.question}</div>
      <ul className="mt-2 space-y-2">
        {poll.options.map((o, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="flex-1 rounded bg-muted p-2">
              <div className="flex items-center justify-between text-sm">
                <span>{o.label}</span>
                <span className="text-muted-foreground">{o.votes} votes</span>
              </div>
              <div className="mt-1 h-1 rounded bg-primary/20" aria-hidden>
                <div
                  className="h-1 rounded bg-primary"
                  style={{
                    width:
                      (100 * o.votes) /
                        Math.max(
                          1,
                          poll.options.reduce((a, b) => a + b.votes, 0),
                        ) +
                      "%",
                  }}
                />
              </div>
            </div>
            {!readOnly && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const next = [...poll.options]
                  next[i] = { ...next[i], votes: next[i].votes + 1 }
                  setPoll({ ...poll, options: next })
                }}
              >
                Vote
              </Button>
            )}
          </li>
        ))}
      </ul>
      {!readOnly && (
        <div className="mt-2 flex gap-2">
          <Input
            placeholder="Add option"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = (e.target as HTMLInputElement).value.trim()
                if (v) {
                  setPoll((p) => ({ ...p, options: [...p.options, { label: v, votes: 0 }] }))
                  ;(e.target as HTMLInputElement).value = ""
                }
              }
            }}
          />
          <Button variant="secondary">Close</Button>
        </div>
      )}
    </Card>
  )
}
