// Type definitions for the AI Threat Intelligence Report JSON schema

export interface Threat {
  id: number;
  title: string;
  source: string;
  type: ThreatType;
  risk_score: RiskLevel;
  risk_justification: string;
  affected_products: string[];
  summary: string;
  recommended_action: string;
  reference_link: string | null;
}

export type RiskLevel = "Critical" | "High" | "Medium" | "Low";

export type ThreatType =
  | "CVE/Vulnerability"
  | "Ransomware"
  | "Phishing"
  | "Malware"
  | "Data Breach"
  | "APT"
  | "Supply Chain"
  | "Social Engineering"
  | "Other";

export interface IOCSummary {
  cve_ids: string[];
  affected_vendors: string[];
}

export interface ThreatReport {
  report_title: string;
  executive_summary: string;
  overall_risk_level: RiskLevel;
  threat_count: number;
  threats: Threat[];
  top_recommendations: string[];
  ioc_summary: IOCSummary;
  generated_at?: string;
}
