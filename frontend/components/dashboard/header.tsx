"use client";

import { Shield, Radio, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function DashboardHeader({
  onRefresh,
  isLoading,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20">
            <Shield className="h-5 w-5 text-teal-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight truncate">
              Threat Intelligence Dashboard
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
              <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>
    </header>
  );
}
