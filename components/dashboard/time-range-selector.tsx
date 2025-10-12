"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type TimeRange = "7d" | "30d" | "90d";

const ranges: { label: string; value: TimeRange }[] = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
]

interface TimeRangeSelectorProps {
  value?: TimeRange;
  onChange?: (range: TimeRange) => void;
}

export function TimeRangeSelector({ 
  value = "7d", 
  onChange 
}: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant="ghost"
          size="sm"
          onClick={() => onChange?.(range.value)}
          className={cn(
            "rounded-md px-3 h-8 text-sm font-medium transition-colors",
            value === range.value
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
