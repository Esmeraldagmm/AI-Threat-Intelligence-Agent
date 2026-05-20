"use client";

import { useState, useEffect } from "react";
import { ThreatReport } from "@/types/threat-reports";
import { DashboardHeader } from "@/components/dashboard/header";
import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { ThreatList } from "@/components/dashboard/threat-list";
import { IOCSummarySection } from "@/components/dashboard/ioc-summary";
import { RecommendationsSection } from "@/components/dashboard/recommendations";
import { ThreatAnalytics } from "@/components/dashboard/threat-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BarChart3, Shield, Loader2, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const [report, setReport] = useState<ThreatReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reports/latest", {
        signal: AbortSignal.timeout(60000),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to fetch threat intelligence data",
      );
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            {/* Outer pulsing ring */}
            <span className="absolute inset-0 rounded-full animate-ping bg-teal-500/20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/10">
              <Shield className="h-7 w-7 text-teal-400" />
              <Loader2 className="h-4 w-4 text-teal-400 animate-spin absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-base font-semibold tracking-tight">Loading Threat Intelligence</h2>
            <p className="text-sm text-muted-foreground">Analyzing latest security data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 text-center max-w-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold">Failed to Load Report</h2>
            <p className="text-sm text-muted-foreground">
              {error || "Unable to fetch threat intelligence data"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReport}
            className="gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onRefresh={fetchReport} isLoading={isLoading} />

      <main className="py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 sm:px-6">
          <ExecutiveSummary report={report} />

          <Tabs defaultValue="threats" className="space-y-4">
            <TabsList className="flex w-full flex-wrap justify-start gap-1 rounded-xl border border-border/40 bg-card/60 p-1 backdrop-blur-sm">
              <TabsTrigger
                value="threats"
                className="gap-2 flex-1 sm:flex-none rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Threats
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="gap-2 flex-1 sm:flex-none rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="actions"
                className="gap-2 flex-1 sm:flex-none rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Shield className="h-3.5 w-3.5" />
                Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="threats" className="space-y-4 mt-0">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ThreatList threats={report.threats} />
                </div>
                <div className="space-y-4">
                  <IOCSummarySection iocSummary={report.ioc_summary} />
                  <RecommendationsSection recommendations={report.top_recommendations} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <ThreatAnalytics threats={report.threats} />
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <RecommendationsSection recommendations={report.top_recommendations} />
                <IOCSummarySection iocSummary={report.ioc_summary} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t border-border/30 py-4 mt-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 sm:px-6">
          <span className="text-xs text-muted-foreground/60">
            AI Threat Intelligence Agent · Capstone Project
          </span>
        </div>
      </footer>
    </div>
  );
}
