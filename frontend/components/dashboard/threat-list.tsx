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
import { ChevronDown, ChevronUp, ExternalLink, Filter } from "lucide-react";

interface ThreatListProps {
  threats: Threat[];
}

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

export function ThreatList({ threats }: ThreatListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<RiskLevel | "All">(
    "All",
  );
  const [filterType, setFilterType] = useState<ThreatType | "All">("All");

  const threatList = threats || [];
  const filteredThreats = threatList.filter((threat) => {
    if (filterSeverity !== "All" && threat.risk_score !== filterSeverity)
      return false;
    if (filterType !== "All" && threat.type !== filterType) return false;
    return true;
  });

  // Get unique threat types from data
  const threatTypes = Array.from(new Set(threatList.map((t) => t.type)));

  return (
    <Card className="border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-primary" />
            Active Threats
            <Badge variant="secondary" className="ml-2 shrink-0">
              {filteredThreats.length}
            </Badge>
          </CardTitle>

          {/* Filters */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterSeverity}
              onChange={(e) =>
                setFilterSeverity(e.target.value as RiskLevel | "All")
              }
              className="w-full rounded-md border border-border/50 bg-secondary/50 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary sm:w-auto"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as ThreatType | "All")
              }
              className="w-full rounded-md border border-border/50 bg-secondary/50 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary sm:w-auto"
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
        <div className="h-125 overflow-y-auto pr-4">
          <div className="space-y-3">
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
              <div className="text-center py-8 text-muted-foreground">
                No threats match the current filters
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
      className={`rounded-lg border transition-all duration-200 ${
        threat.risk_score === "Critical"
          ? "border-red-500/50 bg-red-500/5"
          : threat.risk_score === "High"
            ? "border-orange-500/30 bg-orange-500/5"
            : "border-border/50 bg-secondary/20"
      }`}
    >
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full rounded-lg p-4 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className={`mt-0.5 ${typeColor}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm leading-tight text-balance">
                {threat.title}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${typeColor} border-current`}
                >
                  {threat.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Source: {threat.source}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <Badge
              className={`${getRiskBadgeColor(threat.risk_score)} font-semibold`}
            >
              {threat.risk_score}
            </Badge>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 space-y-4 border-t border-border/30 mt-0">
          <div className="pt-4">
            {/* Summary */}
            <div className="mb-3">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">
                Summary
              </h4>
              <p className="text-sm leading-relaxed">{threat.summary}</p>
            </div>

            {/* Risk Justification */}
            <div className="mb-3">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">
                Risk Justification
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {threat.risk_justification}
              </p>
            </div>

            {/* Affected Products */}
            {threat.affected_products.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Server className="h-3 w-3" />
                  Affected Products
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {threat.affected_products.map((product, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Action */}
            <div className="rounded-md bg-teal-500/5 border border-teal-500/20 p-3 mb-3">
              <h4 className="text-xs font-medium text-teal-500 mb-1 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Recommended Action
              </h4>
              <p className="text-sm">{threat.recommended_action}</p>
            </div>

            {/* Reference Link */}
            {threat.reference_link && (
              <a
                href={threat.reference_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                View Reference
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
