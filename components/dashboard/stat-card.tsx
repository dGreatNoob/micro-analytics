import type React from "react"
import { Card } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change?: number
  icon?: React.ReactNode
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold text-card-foreground">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive && <ArrowUp className="h-4 w-4 text-green-500" />}
              {isNegative && <ArrowDown className="h-4 w-4 text-red-500" />}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive && "text-green-500",
                  isNegative && "text-red-500",
                  !isPositive && !isNegative && "text-muted-foreground",
                )}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              <span className="text-sm text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        {icon && <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>}
      </div>
    </Card>
  )
}
