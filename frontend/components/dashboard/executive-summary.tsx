"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThreatReport } from "@/types/threat-reports";
import {
  getRiskColor,
  getRiskBgColor,
  getRiskIcon,
  Shield,
  AlertTriangle,
  Clock,
  Activity,
} from "@/lib/threat-utils";

interface ExecutiveSummaryProps {
  report: ThreatReport;
}

function useCountUp(target: number, duration = 800) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (target === 0) { setCurrent(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCurrent(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return current;
}

const RISK_ICON_COMPONENTS = {
  Critical: getRiskIcon("Critical"),
  High: getRiskIcon("High"),
  Medium: getRiskIcon("Medium"),
  Low: getRiskIcon("Low"),
} as const;

export function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  const threats = report.threats || [];
  const severityCounts = {
    Critical: threats.filter((t) => t.risk_score === "Critical").length,
    High: threats.filter((t) => t.risk_score === "High").length,
    Medium: threats.filter((t) => t.risk_score === "Medium").length,
    Low: threats.filter((t) => t.risk_score === "Low").length,
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent" />

      <CardHeader className="pb-4 sm:pb-5 relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
              <Shield className="h-6 w-6 text-teal-400" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
                {report.report_title}
              </CardTitle>
              {report.generated_at && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>
                    Generated:{" "}
                    {new Date(report.generated_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 shrink-0 ${getRiskBgColor(report.overall_risk_level)}`}
          >
            <RiskIconComponent
              riskLevel={report.overall_risk_level}
              className={`h-5 w-5 ${getRiskColor(report.overall_risk_level)}`}
            />
            <div className="text-right">
              <div className="text-xs font-medium text-muted-foreground">Overall Risk</div>
              <div className={`text-lg font-bold tracking-tight ${getRiskColor(report.overall_risk_level)}`}>
                {report.overall_risk_level}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Total Threats"
            value={report.threat_count}
            icon={AlertTriangle}
            color="text-teal-400"
          />
          <StatCard
            label="Critical"
            value={severityCounts.Critical}
            color="text-red-400"
            pulse={severityCounts.Critical > 0}
          />
          <StatCard
            label="High"
            value={severityCounts.High}
            color="text-orange-400"
          />
          <StatCard
            label="Med / Low"
            value={severityCounts.Medium + severityCounts.Low}
            color="text-yellow-400"
          />
        </div>

        {/* Executive Summary Text */}
        <div className="rounded-xl border border-border/40 bg-secondary/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-teal-400 shrink-0" />
            <span className="text-sm font-medium">Executive Summary</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.executive_summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface RiskIconComponentProps {
  riskLevel: string;
  className?: string;
}

function RiskIconComponent({ riskLevel, className }: RiskIconComponentProps) {
  const Icon =
    RISK_ICON_COMPONENTS[riskLevel as keyof typeof RISK_ICON_COMPONENTS] ?? Shield;
  return <Icon className={className} />;
}

interface StatCardProps {
  label: string;
  value: number;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  pulse?: boolean;
}

function StatCard({ label, value, icon: Icon, color = "text-foreground", pulse }: StatCardProps) {
  const displayValue = useCountUp(value);

  return (
    <div className="group relative rounded-xl border border-border/40 bg-secondary/40 p-4 sm:p-5 transition-all duration-200 hover:border-border/70 hover:bg-secondary/60">
      {pulse && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
        </span>
      )}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {Icon && <Icon className={`h-4 w-4 ${color}`} />}
      </div>
      <div className={`text-3xl font-bold tracking-tight tabular-nums ${color}`}>
        {displayValue}
      </div>
    </div>
  );
}
