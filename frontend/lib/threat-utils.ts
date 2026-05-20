"use client";

// Local type definitions to avoid missing module import for ../types/threat-report
export type RiskLevel = "Critical" | "High" | "Medium" | "Low" | string;
export type ThreatType =
  | "CVE/Vulnerability"
  | "Ransomware"
  | "Phishing"
  | "Malware"
  | "Data Breach"
  | "APT"
  | "Supply Chain"
  | "Social Engineering"
  | string;
import {
  Shield,
  AlertTriangle,
  AlertCircle,
  Info,
  Bug,
  Mail,
  Skull,
  Database,
  Target,
  Link as LinkIcon,
  Boxes,
  Users,
  Clock,
  Activity,
  FileWarning,
  ShieldAlert,
  Zap,
  Server,
} from "lucide-react";

// Risk level color utilities
export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "Critical":
      return "text-red-500";
    case "High":
      return "text-orange-500";
    case "Medium":
      return "text-yellow-500";
    case "Low":
      return "text-emerald-500";
    default:
      return "text-muted-foreground";
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case "Critical":
      return "bg-red-500/20 border-red-500/50";
    case "High":
      return "bg-orange-500/20 border-orange-500/50";
    case "Medium":
      return "bg-yellow-500/20 border-yellow-500/50";
    case "Low":
      return "bg-emerald-500/20 border-emerald-500/50";
    default:
      return "bg-muted";
  }
}

export function getRiskBadgeColor(level: RiskLevel): string {
  switch (level) {
    case "Critical":
      return "bg-red-500 text-white";
    case "High":
      return "bg-orange-500 text-black";
    case "Medium":
      return "bg-yellow-500 text-black";
    case "Low":
      return "bg-emerald-500 text-black";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getRiskIcon(level: RiskLevel) {
  switch (level) {
    case "Critical":
      return ShieldAlert;
    case "High":
      return AlertTriangle;
    case "Medium":
      return AlertCircle;
    case "Low":
      return Info;
    default:
      return Shield;
  }
}

// Threat type icon utilities
export function getThreatTypeIcon(type: ThreatType) {
  switch (type) {
    case "CVE/Vulnerability":
      return Bug;
    case "Ransomware":
      return Skull;
    case "Phishing":
      return Mail;
    case "Malware":
      return FileWarning;
    case "Data Breach":
      return Database;
    case "APT":
      return Target;
    case "Supply Chain":
      return Boxes;
    case "Social Engineering":
      return Users;
    default:
      return AlertCircle;
  }
}

export function getThreatTypeColor(type: ThreatType): string {
  switch (type) {
    case "CVE/Vulnerability":
      return "text-blue-400";
    case "Ransomware":
      return "text-red-400";
    case "Phishing":
      return "text-purple-400";
    case "Malware":
      return "text-orange-400";
    case "Data Breach":
      return "text-pink-400";
    case "APT":
      return "text-rose-400";
    case "Supply Chain":
      return "text-amber-400";
    case "Social Engineering":
      return "text-teal-400";
    default:
      return "text-muted-foreground";
  }
}

// Export icons for general use
export {
  Shield,
  AlertTriangle,
  AlertCircle,
  Info,
  Bug,
  Mail,
  Skull,
  Database,
  Target,
  LinkIcon,
  Boxes,
  Users,
  Clock,
  Activity,
  FileWarning,
  ShieldAlert,
  Zap,
  Server,
};
