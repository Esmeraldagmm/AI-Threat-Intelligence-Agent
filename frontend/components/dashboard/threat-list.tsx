"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Threat, RiskLevel, ThreatType } from "@/types/threat-reports";
import {
  getRiskBadgeColor,
  getThreatTypeIcon,
  getThreatTypeColor,
  Server,
  Zap,
} from "@/lib/threat-utils";
import { ChevronDown, ExternalLink } from "lucide-react";

interface ThreatListProps {
  threats: Threat[];
}

const SEVERITY_LEVELS = ["All", "Critical", "High", "Medium", "Low"] as const;
type SeverityFilter = (typeof SEVERITY_LEVELS)[number];

const THREAT_TYPE_ICON_COMPONENTS = {
  "CVE/Vulnerability": getThreatTypeIcon("CVE/Vulnerability"),
  Ransomware: getThreatTypeIcon("Ransomware"),
  Phishing: getThreatTypeIcon("Phishing"),
  Malware: getThreatTypeIcon("Malware"),
  "Data Breach": getThreatTypeIcon("Data Breach"),
  APT: getThreatTypeIcon("APT"),
  "Supply Chain": getThreatTypeIcon("Supply Chain"),
  "Social Engineering": getThreatTypeIcon("Social Engineering"),
} as const;

function getSeverityPillStyle(level: SeverityFilter, isActive: boolean): string {
  if (!isActive) {
    return "border border-transparent text-muted-foreground hover:border-border/60 hover:text-foreground";
  }
  switch (level) {
    case "Critical":
      return "border border-red-500/40 bg-red-500/15 text-red-400";
    case "High":
      return "border border-orange-500/40 bg-orange-500/15 text-orange-400";
    case "Medium":
      return "border border-yellow-500/40 bg-yellow-500/15 text-yellow-400";
    case "Low":
      return "border border-emerald-500/40 bg-emerald-500/15 text-emerald-400";
    default:
      return "border border-border/60 bg-secondary text-foreground";
  }
}

export function ThreatList({ threats }: ThreatListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<SeverityFilter>("All");
  const [filterType, setFilterType] = useState<ThreatType | "All">("All");

  const threatList = threats || [];
  const filteredThreats = threatList.filter((threat) => {
    if (filterSeverity !== "All" && threat.risk_score !== filterSeverity) return false;
    if (filterType !== "All" && threat.type !== filterType) return false;
    return true;
  });

  const threatTypes = Array.from(new Set(threatList.map((t) => t.type)));

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Zap className="h-4 w-4 text-teal-400" />
              Active Threats
            </CardTitle>
            <Badge variant="secondary" className="tabular-nums font-mono text-xs">
              {filteredThreats.length}/{threatList.length}
            </Badge>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2.5">
            {/* Severity pill filters */}
            <div className="flex flex-wrap gap-1.5">
              {SEVERITY_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterSeverity(level)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-150 ${getSeverityPillStyle(level, filterSeverity === level)}`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ThreatType | "All")}
              className="w-full rounded-lg border border-border/50 bg-secondary/60 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 sm:w-auto"
            >
              <option value="All">All Types</option>
              {threatTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-125 overflow-y-auto pr-2">
          <div className="space-y-2">
            {filteredThreats.map((threat) => (
              <ThreatCard
                key={threat.id}
                threat={threat}
                isExpanded={expandedId === threat.id}
                onToggle={() =>
                  setExpandedId(expandedId === threat.id ? null : threat.id)
                }
              />
            ))}
            {filteredThreats.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Zap className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No threats match the current filters</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ThreatCardProps {
  threat: Threat;
  isExpanded: boolean;
  onToggle: () => void;
}

function ThreatCard({ threat, isExpanded, onToggle }: ThreatCardProps) {
  const TypeIcon =
    THREAT_TYPE_ICON_COMPONENTS[
      threat.type as keyof typeof THREAT_TYPE_ICON_COMPONENTS
    ] ?? Zap;
  const typeColor = getThreatTypeColor(threat.type);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        threat.risk_score === "Critical"
          ? "border-red-500/40 bg-red-500/5 hover:bg-red-500/8"
          : threat.risk_score === "High"
            ? "border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/8"
            : "border-border/40 bg-secondary/20 hover:bg-secondary/40"
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full rounded-xl p-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
      >
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className={`mt-0.5 shrink-0 ${typeColor}`}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm leading-snug">{threat.title}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={`text-xs py-0 ${typeColor} border-current/40`}
                >
                  {threat.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {threat.source}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <Badge className={`${getRiskBadgeColor(threat.risk_score)} text-xs font-semibold`}>
              {threat.risk_score}
            </Badge>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {/* Expandable content using CSS grid trick for smooth animation */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
          transition: "grid-template-rows 250ms ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="px-3.5 pb-3.5 space-y-3 border-t border-border/30">
            <div className="pt-3 space-y-3">
              {/* Summary */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Summary</h4>
                <p className="text-sm leading-relaxed">{threat.summary}</p>
              </div>

              {/* Risk Justification */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Risk Justification</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {threat.risk_justification}
                </p>
              </div>

              {/* Affected Products */}
              {threat.affected_products.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Server className="h-3 w-3" />
                    Affected Products
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {threat.affected_products.map((product, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-normal">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Action */}
              <div className="rounded-lg bg-teal-500/8 border border-teal-500/20 p-3">
                <h4 className="text-xs font-medium text-teal-400 mb-1 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Recommended Action
                </h4>
                <p className="text-sm leading-relaxed">{threat.recommended_action}</p>
              </div>

              {/* Reference Link */}
              {threat.reference_link && (
                <a
                  href={threat.reference_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Reference
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
