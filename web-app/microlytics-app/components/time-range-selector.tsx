"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

const ranges = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
  { label: "12m", value: "12m" },
]

export function TimeRangeSelector() {
  const [selected, setSelected] = useState("7d")

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant="ghost"
          size="sm"
          onClick={() => setSelected(range.value)}
          className={cn(
            "rounded-md px-3 h-8 text-sm font-medium transition-colors",
            selected === range.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}
