import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
      <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
      <p className="text-destructive font-medium mb-2">Error loading analytics</p>
      <p className="text-destructive/80 text-sm mb-4">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
}

