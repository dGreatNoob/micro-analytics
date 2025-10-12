import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "No data available",
  description = "No analytics data for this period. Make sure your tracking script is installed and receiving traffic.",
  actionLabel = "View Setup Guide",
  actionHref = "/dashboard/sites",
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <BarChart3 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">{description}</p>
      <Button asChild variant="outline">
        <a href={actionHref}>{actionLabel}</a>
      </Button>
    </div>
  );
}

