"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const [accent, setAccent] = useState<"cyan" | "purple" | "green">("cyan")
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent)
  }, [accent])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="flex items-center gap-1">
      <Button size="sm" variant="secondary" onClick={() => setDark((d) => !d)}>
        {dark ? "Light" : "Dark"}
      </Button>
      <Button size="sm" variant={accent === "cyan" ? "default" : "secondary"} onClick={() => setAccent("cyan")}>
        Cyan
      </Button>
      <Button size="sm" variant={accent === "purple" ? "default" : "secondary"} onClick={() => setAccent("purple")}>
        Purple
      </Button>
      <Button size="sm" variant={accent === "green" ? "default" : "secondary"} onClick={() => setAccent("green")}>
        Green
      </Button>
    </div>
  )
}
