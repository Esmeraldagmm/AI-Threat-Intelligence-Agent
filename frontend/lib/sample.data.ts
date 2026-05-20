import { ThreatReport } from "@/types/threat-reports";

// Sample data for development and demo purposes
// This matches the JSON schema from your Python backend
export const sampleReport: ThreatReport = {
  report_title: "Threat Intelligence Report — May 19, 2026",
  executive_summary:
    "The current threat landscape shows elevated activity with multiple critical vulnerabilities being actively exploited in the wild. Ransomware campaigns targeting healthcare and critical infrastructure sectors continue to escalate. Organizations should prioritize patching CVE-2026-21410 and CVE-2026-15893 immediately due to active exploitation.",
  overall_risk_level: "Critical",
  threat_count: 10,
  generated_at: new Date().toISOString(),
  threats: [
    {
      id: 1,
      title: "Critical Zero-Day in Microsoft Exchange Server",
      source: "CISA",
      type: "CVE/Vulnerability",
      risk_score: "Critical",
      risk_justification:
        "Active exploitation observed in the wild with no patch currently available. Widespread impact affecting enterprise environments globally.",
      affected_products: [
        "Microsoft Exchange Server 2019",
        "Microsoft Exchange Server 2016",
      ],
      summary:
        "A critical zero-day vulnerability (CVE-2026-21410) in Microsoft Exchange Server allows remote code execution without authentication. Threat actors are actively exploiting this vulnerability to deploy web shells and establish persistent access.",
      recommended_action:
        "Implement Microsoft's recommended mitigations immediately. Monitor for indicators of compromise. Consider taking Exchange servers offline if not business-critical until patch is available.",
      reference_link:
        "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    },
    {
      id: 2,
      title: "LockBit 4.0 Ransomware Campaign Targeting Healthcare",
      source: "The Hacker News",
      type: "Ransomware",
      risk_score: "Critical",
      risk_justification:
        "Active campaign targeting critical infrastructure with high success rate. Multiple confirmed victims in the healthcare sector.",
      affected_products: ["Windows Server", "VMware ESXi", "Linux systems"],
      summary:
        "LockBit 4.0 ransomware group has launched a coordinated campaign specifically targeting healthcare organizations. The new variant includes improved encryption and data exfiltration capabilities.",
      recommended_action:
        "Ensure offline backups are current. Review and harden RDP access. Implement network segmentation. Deploy EDR solutions with ransomware-specific detections.",
      reference_link: "https://thehackernews.com",
    },
    {
      id: 3,
      title: "APT29 Spear-Phishing Campaign Using AI-Generated Content",
      source: "CISA",
      type: "APT",
      risk_score: "High",
      risk_justification:
        "State-sponsored threat actor with proven capabilities. Active campaign using sophisticated social engineering.",
      affected_products: ["Microsoft 365", "Google Workspace"],
      summary:
        "APT29 (Cozy Bear) has been observed conducting spear-phishing campaigns using AI-generated emails that are nearly indistinguishable from legitimate communications. The campaign targets government and defense contractors.",
      recommended_action:
        "Enhance email security with AI-based detection. Conduct employee awareness training on AI-generated phishing. Implement DMARC, DKIM, and SPF.",
      reference_link: "https://www.cisa.gov/apt29",
    },
    {
      id: 4,
      title: "Critical Authentication Bypass in Cisco IOS XE",
      source: "CISA",
      type: "CVE/Vulnerability",
      risk_score: "High",
      risk_justification:
        "Patch available but not widely applied. Network infrastructure vulnerability with potential for widespread impact.",
      affected_products: ["Cisco IOS XE 17.x", "Cisco IOS XE 16.x"],
      summary:
        "CVE-2026-15893 allows attackers to bypass authentication on Cisco devices running IOS XE, potentially gaining administrative access to network infrastructure.",
      recommended_action:
        "Apply Cisco security patches immediately. Audit network device configurations. Monitor for unauthorized administrative access.",
      reference_link: "https://sec.cloudapps.cisco.com/security/center",
    },
    {
      id: 5,
      title: "Supply Chain Attack via Compromised npm Package",
      source: "The Hacker News",
      type: "Supply Chain",
      risk_score: "High",
      risk_justification:
        "Malicious package downloaded over 500,000 times before removal. Active data exfiltration confirmed.",
      affected_products: ["Node.js applications", "npm ecosystem"],
      summary:
        "A popular npm package 'event-stream-utils' was found to contain malicious code that exfiltrates environment variables and API keys to attacker-controlled servers.",
      recommended_action:
        "Audit dependencies for compromised package. Rotate all API keys and secrets if package was used. Implement software composition analysis in CI/CD pipelines.",
      reference_link: "https://thehackernews.com",
    },
    {
      id: 6,
      title: "QakBot Malware Resurges with New Delivery Mechanism",
      source: "CISA",
      type: "Malware",
      risk_score: "Medium",
      risk_justification:
        "Known malware family with updated TTPs. Patch available and detection signatures updated.",
      affected_products: ["Windows 10", "Windows 11", "Microsoft Office"],
      summary:
        "QakBot malware has returned with a new delivery mechanism using OneNote files to bypass traditional email security controls. The malware establishes persistence and downloads additional payloads.",
      recommended_action:
        "Block OneNote attachments at the email gateway. Update endpoint protection signatures. Train users on new phishing techniques.",
      reference_link: "https://www.cisa.gov",
    },
    {
      id: 7,
      title: "Data Breach at Major Cloud Provider Exposes Customer Data",
      source: "The Hacker News",
      type: "Data Breach",
      risk_score: "Medium",
      risk_justification:
        "Limited impact scope. Affected provider has notified customers and implemented additional controls.",
      affected_products: ["Cloud storage services"],
      summary:
        "A misconfigured S3 bucket at a major cloud provider exposed customer metadata and API configurations for approximately 50,000 accounts.",
      recommended_action:
        "Review your cloud storage configurations. Enable bucket versioning and access logging. Implement Cloud Security Posture Management (CSPM).",
      reference_link: "https://thehackernews.com",
    },
    {
      id: 8,
      title: "Social Engineering Campaign Targeting IT Help Desks",
      source: "CISA",
      type: "Social Engineering",
      risk_score: "Medium",
      risk_justification:
        "Proven tactic with moderate success rate. Can be mitigated with proper verification procedures.",
      affected_products: ["Identity management systems", "Help desk platforms"],
      summary:
        "Threat actors are calling IT help desks impersonating employees to request password resets and MFA bypasses. The campaign has successfully compromised several organizations.",
      recommended_action:
        "Implement callback verification for password resets. Require manager approval for MFA changes. Train help desk staff on verification procedures.",
      reference_link: "https://www.cisa.gov",
    },
    {
      id: 9,
      title: "Vulnerability in Popular WordPress Plugin",
      source: "The Hacker News",
      type: "CVE/Vulnerability",
      risk_score: "Low",
      risk_justification:
        "Patch available and widely applied. No active exploitation observed. Limited impact scope.",
      affected_products: ["WordPress", "WooCommerce"],
      summary:
        "A SQL injection vulnerability in a WordPress e-commerce plugin could allow authenticated attackers to access database contents. The vulnerability requires authenticated access with editor privileges.",
      recommended_action:
        "Update affected plugins to latest version. Review WordPress user privileges. Enable Web Application Firewall rules.",
      reference_link: "https://thehackernews.com",
    },
    {
      id: 10,
      title: "Credential Stuffing Attacks Increase Against Financial Services",
      source: "CISA",
      type: "Phishing",
      risk_score: "Low",
      risk_justification:
        "Common attack vector with known mitigations. No new techniques observed.",
      affected_products: ["Online banking platforms", "Investment portals"],
      summary:
        "CISA reports an increase in credential stuffing attacks targeting financial services, using credentials from previous breaches to attempt account takeovers.",
      recommended_action:
        "Implement rate limiting on authentication endpoints. Deploy bot detection solutions. Enforce MFA for all user accounts.",
      reference_link: "https://www.cisa.gov",
    },
  ],
  top_recommendations: [
    "Immediately patch Microsoft Exchange Server CVE-2026-21410 or implement recommended mitigations",
    "Verify offline backup integrity and test restoration procedures for ransomware readiness",
    "Audit and harden remote access configurations, especially RDP and VPN endpoints",
    "Deploy AI-based email security to counter sophisticated phishing campaigns",
    "Implement software composition analysis to detect supply chain compromises",
  ],
  ioc_summary: {
    cve_ids: [
      "CVE-2026-21410",
      "CVE-2026-15893",
      "CVE-2026-12847",
      "CVE-2026-09234",
    ],
    affected_vendors: [
      "Microsoft",
      "Cisco",
      "WordPress",
      "VMware",
      "Linux Foundation",
    ],
  },
};
