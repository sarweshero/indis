"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MiniGames() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="p-3 bg-card/80">
        <div className="font-medium">Trivia</div>
        <div className="text-sm text-muted-foreground">Quick 5-question round.</div>
        <Button className="mt-2" variant="secondary">
          Start
        </Button>
      </Card>
      <Card className="p-3 bg-card/80">
        <div className="font-medium">Watch Party</div>
        <div className="text-sm text-muted-foreground">Share a link to watch together.</div>
        <Button className="mt-2" variant="secondary">
          Create Room
        </Button>
      </Card>
    </div>
  )
}
