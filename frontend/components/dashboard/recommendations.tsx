"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield } from "lucide-react";

interface RecommendationsSectionProps {
  recommendations: string[];
}

export function RecommendationsSection({
  recommendations,
}: RecommendationsSectionProps) {
  const recs = recommendations || [];

  return (
    <Card className="border-teal-500/30 bg-teal-500/5 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-teal-500" />
          Priority Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {recs.map((rec, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-zinc-800/70 bg-zinc-900/70 p-3 transition-colors hover:bg-zinc-900/90"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-teal-500 text-xs font-extrabold">
                {idx + 1}
              </div>
              <span className="text-sm leading-relaxed flex-1">{rec}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
