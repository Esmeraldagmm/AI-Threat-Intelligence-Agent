# main.py
# ─────────────────────────────────────────────────────────────────
# This is the entry point of the threat intel agent.
# It supports two modes:
#
#   1. MANUAL MODE   — you run it yourself with an optional query
#                      e.g. python main.py
#                      e.g. python main.py "focus on ransomware"
#
#   2. SCHEDULED MODE — runs automatically every X hours
#                       e.g. python main.py --schedule
#
# Output: saves the JSON report to the /reports folder
# ─────────────────────────────────────────────────────────────────

import json
import os
import sys
import time
from datetime import datetime

from data_collector import collect_all
from groq_analyzer import analyze_threats


# The Settings 

# How many items to fetch from each source per run
FETCH_LIMIT = 10

# How often the scheduler runs (in hours)
SCHEDULE_INTERVAL_HOURS = 6

# Folder where reports get saved locally
REPORTS_DIR = "reports"


# The Helpers

def save_report(report: dict):
    """Saves the JSON report to a timestamped file in /reports."""
    os.makedirs(REPORTS_DIR, exist_ok=True)
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"{REPORTS_DIR}/threat_report_{timestamp}.json"

    with open(filename, "w") as f:
        json.dump(report, f, indent=2)

    print(f"[✓] Report saved to: {filename}")
    return filename


def print_summary(report: dict):
    """Prints a quick human-readable summary to the terminal."""
    print("\n" + "="*50)
    print(f"  {report.get('report_title', 'Threat Intelligence Report')}")
    print("="*50)
    print(f"  Overall Risk Level : {report.get('overall_risk_level', 'N/A')}")
    print(f"  Total Threats Found: {report.get('threat_count', 0)}")
    print(f"\n  Executive Summary:")
    print(f"  {report.get('executive_summary', 'N/A')}")
    print("\n  Top Recommendations:")
    for i, rec in enumerate(report.get("top_recommendations", []), 1):
        print(f"    {i}. {rec}")
    print("="*50 + "\n")


# This is the core run function  

def run(user_query=None):
    """
    Runs one full cycle:
      1. Collect data from CISA + Hacker News
      2. Send to Groq for analysis
      3. Save JSON report to /reports
      4. Print summary to terminal
    """
    print(f"\n[→] Starting threat intel run at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}")
    if user_query:
        print(f"[→] User query: \"{user_query}\"")

    # Step 1: For collection
    collected_data = collect_all(limit=FETCH_LIMIT)

    # Step 2: Analyze with Groq AI
    report = analyze_threats(collected_data, user_query=user_query)

    # Step 3: Save & display
    if "error" not in report:
        save_report(report)
        print_summary(report)
    else:
        print(f"[✗] Report generation failed: {report.get('error')}")

    return report


# The scheduled mode 

def run_scheduled():
    """
    Runs the agent on a loop every SCHEDULE_INTERVAL_HOURS hours.
    Press Ctrl+C to stop.
    """
    print(f"\n[⏱] Scheduled mode: running every {SCHEDULE_INTERVAL_HOURS} hour(s).")
    print("[⏱] Press Ctrl+C to stop.\n")

    while True:
        run()
        next_run = SCHEDULE_INTERVAL_HOURS * 3600
        print(f"[⏱] Next run in {SCHEDULE_INTERVAL_HOURS} hour(s). Sleeping...\n")
        time.sleep(next_run)


# The Entry Point 

if __name__ == "__main__":
    if "--schedule" in sys.argv:
        run_scheduled()
    else:
        # Optional: pass a focus query as a command line argument
        # Example: python main.py "focus on ransomware and phishing"
        query = " ".join(arg for arg in sys.argv[1:] if not arg.startswith("--"))
        run(user_query=query if query else None)