import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onRefresh: () => void; // Callback to handle refresh logic
}

export function RefreshButton({ onRefresh }: RefreshButtonProps) {
  const [isPending, startTransition] = React.useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      onRefresh(); // Execute the provided refresh callback
    });
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isPending}
      variant="outline"
      className="w-full md:w-auto bg-transparent text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
    >
      <RefreshCw
        className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`}
      />
      {isPending ? "Refreshing..." : "Refresh"}
    </Button>
  );
}