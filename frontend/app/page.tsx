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
import { AlertTriangle, BarChart3, Shield, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [report, setReport] = useState<ThreatReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      //fetch from FastAPI backend
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const response = await fetch(`${API_URL}/api/reports/latest`);

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
    const load = async () => {
      await fetchReport();
    };

    load();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Shield className="h-12 w-12 text-primary" />
            <Loader2 className="h-6 w-6 text-primary animate-spin absolute -bottom-1 -right-1" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-medium">Loading Threat Intelligence</h2>
            <p className="text-sm text-muted-foreground">
              Analyzing latest security data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-medium">Failed to Load Report</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error || "Unable to fetch threat intelligence data"}
          </p>
          <button
            onClick={fetchReport}
            className="text-primary hover:underline text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onRefresh={fetchReport} isLoading={isLoading} />

      <main className="py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6">
          {/* Executive Summary - Always visible at top */}
          <ExecutiveSummary report={report} />

          {/* Tabbed Content */}
          <Tabs defaultValue="threats" className="space-y-4">
            <TabsList className="flex w-full flex-wrap justify-center gap-2 bg-secondary/50">
              <TabsTrigger
                value="threats"
                className="gap-2 flex-1 sm:flex-none"
              >
                <AlertTriangle className="h-4 w-4" />
                Threats
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="gap-2 flex-1 sm:flex-none"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="actions"
                className="gap-2 flex-1 sm:flex-none"
              >
                <Shield className="h-4 w-4" />
                Actions
              </TabsTrigger>
            </TabsList>

            {/* Threats Tab */}
            <TabsContent value="threats" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ThreatList threats={report.threats} />
                </div>
                <div className="space-y-4">
                  <IOCSummarySection iocSummary={report.ioc_summary} />
                  <RecommendationsSection
                    recommendations={report.top_recommendations}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <ThreatAnalytics threats={report.threats} />
            </TabsContent>

            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <RecommendationsSection
                  recommendations={report.top_recommendations}
                />
                <IOCSummarySection iocSummary={report.ioc_summary} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4 mt-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 text-xs text-muted-foreground sm:px-6">
          <span>AI Threat Intelligence Agent • Capstone Project</span>
        </div>
      </footer>
    </div>
  );
}
