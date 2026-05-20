import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import Parser from "rss-parser";

export const revalidate = 3600; // Cache report for 1 hour

const CISA_URL =
  "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
const THN_RSS_URL = "https://feeds.feedburner.com/TheHackersNews";
const FETCH_LIMIT = 10;

const SYSTEM_PROMPT = `You are a professional cybersecurity threat intelligence analyst.

Your job is to analyze raw threat data collected from OSINT sources and produce a structured threat intelligence report in JSON format.

For every threat or vulnerability you analyze, you must:
1. Assign a risk score: Critical, High, Medium, or Low
2. Use these criteria:
   - Critical: Active exploitation, no patch available, widespread impact
   - High: Active exploitation, patch available but not widely applied
   - Medium: Potential exploitation, patch available, limited impact
   - Low: Theoretical risk, no known active exploitation
3. Identify the threat type from: [Ransomware, Phishing, CVE/Vulnerability, Malware, Data Breach, APT, Supply Chain, Social Engineering, Other]
4. Always return ONLY valid JSON. No markdown, no explanation, no backticks.

Your output must follow this exact structure:
{
  "report_title": "Threat Intelligence Report — [date]",
  "executive_summary": "2-3 sentence overview",
  "overall_risk_level": "Critical | High | Medium | Low",
  "threat_count": <number>,
  "threats": [
    {
      "id": 1,
      "title": "Short threat title",
      "source": "CISA | The Hacker News",
      "type": "CVE/Vulnerability | Ransomware | Phishing | ...",
      "risk_score": "Critical | High | Medium | Low",
      "risk_justification": "One sentence explaining the score",
      "affected_products": ["product1", "product2"],
      "summary": "2-3 sentence description",
      "recommended_action": "What should be done",
      "reference_link": "URL if available, else null"
    }
  ],
  "top_recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "ioc_summary": {
    "cve_ids": ["CVE-XXXX-XXXX"],
    "affected_vendors": ["vendor1", "vendor2"]
  }
}`;

async function fetchCISA() {
  const res = await fetch(CISA_URL, { next: { revalidate: 3600 } });
  const data = await res.json();
  const vulns: Record<string, string>[] = data.vulnerabilities ?? [];
  return vulns
    .sort((a, b) =>
      (b.dateAdded ?? "").localeCompare(a.dateAdded ?? "")
    )
    .slice(0, FETCH_LIMIT)
    .map((v) => ({
      cve_id: v.cveID,
      vendor: v.vendorProject,
      product: v.product,
      vulnerability: v.vulnerabilityName,
      date_added: v.dateAdded,
      required_action: v.requiredAction,
      short_description: v.shortDescription,
    }));
}

async function fetchHackerNews() {
  const parser = new Parser();
  const feed = await parser.parseURL(THN_RSS_URL);
  return feed.items.slice(0, FETCH_LIMIT).map((entry) => ({
    title: entry.title ?? "",
    link: entry.link ?? "",
    published: entry.pubDate ?? "",
    summary: entry.contentSnippet ?? "",
  }));
}

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not set" }, { status: 500 });
  }

  try {
    const [cisaData, thnData] = await Promise.all([
      fetchCISA(),
      fetchHackerNews(),
    ]);

    const collectedData = {
      collected_at: new Date().toUTCString(),
      cisa_vulnerabilities: cisaData,
      hacker_news_articles: thnData,
    };

    const client = new Groq({ apiKey });
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze the following threat intelligence data collected at ${collectedData.collected_at}.\n\nAnalyze all threats across all categories.\n\n--- RAW DATA ---\n${JSON.stringify(collectedData, null, 2)}\n--- END DATA ---\n\nReturn ONLY the raw JSON object.`,
        },
      ],
    });

    const raw = response.choices[0].message.content ?? "";
    const clean = raw
      .trim()
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    const report = JSON.parse(clean);
    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
