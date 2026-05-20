"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Threat } from "@/types/threat-reports";
import {
  getRiskColor,
  getThreatTypeColor,
  getThreatTypeIcon,
} from "@/lib/threat-utils";
import { PieChart, BarChart3 } from "lucide-react";
import { Shield, Newspaper } from "lucide-react";

interface ThreatAnalyticsProps {
  threats: Threat[];
}

export function ThreatAnalytics({ threats }: ThreatAnalyticsProps) {
  const threatList = threats || [];
  // Calculate severity distribution
  const severityDistribution = {
    Critical: threatList.filter((t) => t.risk_score === "Critical").length,
    High: threatList.filter((t) => t.risk_score === "High").length,
    Medium: threatList.filter((t) => t.risk_score === "Medium").length,
    Low: threatList.filter((t) => t.risk_score === "Low").length,
  };

  // Calculate threat type distribution
  const typeDistribution = threatList.reduce(
    (acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate source distribution
  const sourceDistribution = threatList.reduce(
    (acc, threat) => {
      acc[threat.source] = (acc[threat.source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const total = threatList.length;

  const getSourceIcon = (source: string) => {
    const normalized = source.toLowerCase();

    if (normalized.includes("cisa")) {
      return Shield;
    }

    if (normalized.includes("hacker news")) {
      return Newspaper;
    }

    return null;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Severity Distribution */}
      <Card className="border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <PieChart className="h-4 w-4 text-teal-500" />
            Severity Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(["Critical", "High", "Medium", "Low"] as const).map((level) => {
              const count = severityDistribution[level];
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={level} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={getRiskColor(level)}>{level}</span>
                    <span className="text-muted-foreground">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        level === "Critical"
                          ? "bg-red-500"
                          : level === "High"
                            ? "bg-orange-500"
                            : level === "Medium"
                              ? "bg-yellow-500"
                              : "bg-emerald-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Threat Types */}
      <Card className="border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-teal-500" />
            Threat Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(typeDistribution)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([type, count]) => {
                const typedType = type as Parameters<
                  typeof getThreatTypeIcon
                >[0];
                const TypeIcon = getThreatTypeIcon(typedType);
                const typeColor = getThreatTypeColor(typedType);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={type} className="flex items-center gap-3">
                    <TypeIcon className={`h-4 w-4 shrink-0 ${typeColor}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="truncate">{type}</span>
                        <span className="text-muted-foreground shrink-0 ml-2">
                          {count}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-teal-500/70 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      <Card className="border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Intelligence Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(sourceDistribution).map(([source, count]) => (
              <div
                key={source}
                className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/20 px-3 py-2"
              >
                {(() => {
                  const SourceIcon = getSourceIcon(source);

                  return SourceIcon ? (
                    <SourceIcon className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                  );
                })()}
                <span className="text-sm font-medium">{source}</span>
                <span className="text-xs text-muted-foreground">({count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
