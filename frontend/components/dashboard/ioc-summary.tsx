"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IOCSummary } from "@/types/threat-reports";
import { Bug, Building2, ExternalLink } from "lucide-react";

interface IOCSummarySectionProps {
  iocSummary: IOCSummary;
}

export function IOCSummarySection({ iocSummary }: IOCSummarySectionProps) {
  const cveIds = iocSummary?.cve_ids || [];
  const vendors = iocSummary?.affected_vendors || [];

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Bug className="h-4 w-4 text-teal-400" />
          Indicators of Compromise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CVE IDs */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Bug className="h-3.5 w-3.5" />
            CVE Identifiers
            <span className="ml-auto tabular-nums">{cveIds.length}</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {cveIds.length > 0 ? (
              cveIds.map((cve, idx) => (
                <a
                  key={idx}
                  href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Badge
                    variant="outline"
                    className="text-xs font-mono bg-red-500/8 border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-150 cursor-pointer gap-1"
                  >
                    {cve}
                    <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Badge>
                </a>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No CVEs identified</span>
            )}
          </div>
        </div>

        {/* Affected Vendors */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            Affected Vendors
            <span className="ml-auto tabular-nums">{vendors.length}</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {vendors.length > 0 ? (
              vendors.map((vendor, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs font-normal transition-colors duration-150 hover:bg-secondary/80"
                >
                  {vendor}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No vendors identified</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
