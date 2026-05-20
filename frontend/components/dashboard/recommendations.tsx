"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield } from "lucide-react";

interface RecommendationsSectionProps {
  recommendations: string[];
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  const recs = recommendations || [];

  return (
    <Card className="border-teal-500/25 bg-teal-500/5 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4 text-teal-400" />
          Priority Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {recs.map((rec, idx) => (
            <li
              key={idx}
              className="group flex items-start gap-3 rounded-xl border border-border/40 bg-card/60 p-3 transition-all duration-200 hover:border-border/70 hover:bg-card/80"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-xs font-bold">
                {idx + 1}
              </div>
              <span className="text-sm leading-relaxed flex-1">{rec}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
