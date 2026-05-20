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
    <Card className="border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bug className="h-5 w-5 text-teal-500" />
          Indicators of Compromise (IOC)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CVE IDs */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Bug className="h-3.5 w-3.5 text-muted-foreground" />
            CVE Identifiers ({cveIds.length})
          </h4>
          <div className="flex flex-wrap gap-2">
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
                    className="text-xs font-mono bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    {cve}
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Badge>
                </a>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No CVEs identified
              </span>
            )}
          </div>
        </div>

        {/* Affected Vendors */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            Affected Vendors ({vendors.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {vendors.length > 0 ? (
              vendors.map((vendor, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {vendor}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No vendors identified
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
