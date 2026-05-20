"use client";

import { useState, useEffect } from "react";
import { Shield, Radio, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function DashboardHeader({ onRefresh, isLoading }: DashboardHeaderProps) {
  const [lastRefresh, setLastRefresh] = useState<string>("");

  useEffect(() => {
    setLastRefresh(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setLastRefresh(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }
  }, [isLoading]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-xl border-b border-border/40">
      {/* Teal accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-500/60 to-transparent" />

      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-6">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/25 ring-1 ring-teal-500/10">
            <Shield className="h-5 w-5 text-teal-400" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-500" />
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="text-base font-semibold tracking-tight truncate">
              Threat Intelligence{" "}
              <span className="text-teal-400">Dashboard</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
              <Radio className="h-3 w-3 text-emerald-500 animate-pulse shrink-0" />
              <span>AI-Powered Analysis</span>
              {lastRefresh && (
                <>
                  <span className="text-border">·</span>
                  <span>Updated {lastRefresh}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2 border-border/60 bg-secondary/50 hover:bg-secondary/80 transition-all duration-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
    </header>
  );
}
