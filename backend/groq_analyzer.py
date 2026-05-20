# groq_analyzer.py
# ─────────────────────────────────────────────────────────────────
# Groq's job is to:
#   - Analyze all the threats
#   - Assign a risk score to each one (Critical / High / Medium / Low)
#   - Summarize findings
#   - Return everything as structured JSON
#
# The JSON output from this file gets passed to the report generator.
# ─────────────────────────────────────────────────────────────────

from groq import Groq
import json
from config import GROQ_API_KEY

# Initialize the Groq client with your API key
client = Groq(api_key=GROQ_API_KEY)


# The system prompt - This tells the model exactly what role it plays and how to behave.

SYSTEM_PROMPT = """
You are a professional cybersecurity threat intelligence analyst.

Your job is to analyze raw threat data collected from OSINT sources and produce a
structured threat intelligence report in JSON format.

For every threat or vulnerability you analyze, you must:
1. Assign a risk score: Critical, High, Medium, or Low
2. Use these criteria for scoring:
   - Critical: Active exploitation, no patch available, widespread impact
   - High:     Active exploitation, patch available but not widely applied
   - Medium:   Potential exploitation, patch available, limited impact
   - Low:      Theoretical risk, no known active exploitation

3. Identify the threat type from: [Ransomware, Phishing, CVE/Vulnerability,
   Malware, Data Breach, APT, Supply Chain, Social Engineering, Other]

4. Always return ONLY valid JSON. No markdown, no explanation, no backticks, just the JSON object.

Your output must follow this exact structure:
{
  "report_title": "Threat Intelligence Report — [date]",
  "executive_summary": "2-3 sentence overview of the current threat landscape",
  "overall_risk_level": "Critical | High | Medium | Low",
  "threat_count": <number>,
  "threats": [
    {
      "id": 1,
      "title": "Short threat title",
      "source": "CISA | The Hacker News",
      "type": "CVE/Vulnerability | Ransomware | Phishing | ...",
      "risk_score": "Critical | High | Medium | Low",
      "risk_justification": "One sentence explaining why this score was given",
      "affected_products": ["product1", "product2"],
      "summary": "2-3 sentence description of the threat",
      "recommended_action": "What should be done about this threat",
      "reference_link": "URL if available, else null"
    }
  ],
  "top_recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "ioc_summary": {
    "cve_ids": ["CVE-XXXX-XXXX"],
    "affected_vendors": ["vendor1", "vendor2"]
  }
}
"""


# Analyser Function 

def analyze_threats(collected_data, user_query=None):
    """
    Sends collected threat data to Groq for analysis.

    Parameters:
        collected_data (dict): The output from data_collector.collect_all()
        user_query (str):      Optional — a specific question or focus area
                               e.g. "Focus on ransomware threats only"

    Returns:
        dict: Parsed JSON report from Groq
    """

    print("[*] Sending data to Groq for analysis...")

    # Build the user message — this is the actual data we're asking the model to analyze
    user_message = f"""
Please analyze the following threat intelligence data collected at {collected_data.get('collected_at', 'unknown time')}.

{"User Focus: " + user_query if user_query else "Analyze all threats across all categories."}

--- RAW DATA ---
{json.dumps(collected_data, indent=2)}
--- END DATA ---

Return your full analysis as a JSON object following the structure in your instructions.
Remember: return ONLY the raw JSON object, no markdown, no backticks, no extra text.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": user_message}
            ]
        )
        raw_output = response.choices[0].message.content

        # Parse the JSON response
        try:
            # Strip any accidental markdown code fences just in case
            clean = raw_output.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            report = json.loads(clean)
            print("[✓] Groq analysis complete. Report generated successfully.\n")
            return report

        except json.JSONDecodeError:
            # Try to extract just the JSON block if there's extra text
            print("[!] Warning: response had extra text. Attempting to extract JSON...")
            start = raw_output.find("{")
            end   = raw_output.rfind("}") + 1
            if start != -1 and end != 0:
                report = json.loads(raw_output[start:end])
                print("[✓] JSON extracted successfully.\n")
                return report
            else:
                print("[✗] Could not parse Groq response as JSON.")
                return {"error": "Failed to parse Groq response", "raw": raw_output}

    except Exception as e:
        print(f"[✗] Groq API error: {e}")
        return {"error": str(e)}


# Quick test: 
if __name__ == "__main__":
    from data_collector import collect_all

    # Collect data first
    data = collect_all(limit=5)

    # Then it analyzes it
    report = analyze_threats(data)

    # Prints the result
    print(json.dumps(report, indent=2))