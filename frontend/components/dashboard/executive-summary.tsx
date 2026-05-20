"use client";

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

const RISK_ICON_COMPONENTS = {
  Critical: getRiskIcon("Critical"),
  High: getRiskIcon("High"),
  Medium: getRiskIcon("Medium"),
  Low: getRiskIcon("Low"),
} as const;

export function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  // Count threats by severity
  const threats = report.threats || [];
  const severityCounts = {
    Critical: threats.filter((t) => t.risk_score === "Critical").length,
    High: threats.filter((t) => t.risk_score === "High").length,
    Medium: threats.filter((t) => t.risk_score === "Medium").length,
    Low: threats.filter((t) => t.risk_score === "Low").length,
  };

  return (
    <Card className="border-zinc-950 bg-zinc-950 backdrop-blur-sm">
      <CardHeader className="pb-4 sm:pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10">
              <Shield className="h-6 w-6 text-teal-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                {report.report_title}
              </CardTitle>
              {report.generated_at && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
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
            className={`flex items-center gap-3 rounded-xl border px-5 py-3 ${getRiskBgColor(report.overall_risk_level)}`}
          >
            <RiskIconComponent
              riskLevel={report.overall_risk_level}
              className={`h-6 w-6 ${getRiskColor(report.overall_risk_level)}`}
            />
            <div className="text-right">
              <div className="text-xs font-medium text-muted-foreground">
                Overall Risk
              </div>
              <div
                className={`text-xl font-extrabold tracking-tight ${getRiskColor(report.overall_risk_level)}`}
              >
                {report.overall_risk_level}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total Threats"
            value={report.threat_count}
            icon={AlertTriangle}
            color="text-teal-500"
          />
          <StatCard
            label="Critical"
            value={severityCounts.Critical}
            color="text-red-500"
            pulse={severityCounts.Critical > 0}
          />
          <StatCard
            label="High"
            value={severityCounts.High}
            color="text-orange-500"
          />
          <StatCard
            label="Medium/Low"
            value={severityCounts.Medium + severityCounts.Low}
            color="text-yellow-500"
          />
        </div>

        {/* Executive Summary Text */}
        <div className="rounded-lg border border-zinc-950/80 bg-zinc-900/90 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-teal-500" />
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
    RISK_ICON_COMPONENTS[riskLevel as keyof typeof RISK_ICON_COMPONENTS] ??
    Shield;

  return <Icon className={className} />;
}

interface StatCardProps {
  label: string;
  value: number;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  pulse?: boolean;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-foreground",
  pulse,
}: StatCardProps) {
  return (
    <div className="relative rounded-xl border border-zinc-950/80 bg-zinc-900/95 p-4 sm:p-5">
      {pulse && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
        </span>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className={`h-5 w-5 ${color}`} />}
      </div>
      <div className={`mt-2 text-3xl font-extrabold tracking-tight ${color}`}>
        {value}
      </div>
    </div>
  );
}
