# data_collector.py
# ─────────────────────────────────────────────────────────────────
# This file is responsible for pulling raw threat data from:
#   1. CISA Known Exploited Vulnerabilities (KEV) catalog
#   2. The Hacker News RSS feed
#
# It returns a combined dictionary of raw data that gets passed
# to claude_analyzer.py for analysis.
# ─────────────────────────────────────────────────────────────────

import requests
import feedparser
from datetime import datetime

# ── CISA ──────────────────────────────────────────────────────────
# CISA publishes a free JSON feed of all known exploited CVEs.
# We grab the most recent ones (default: 10).

CISA_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"

def fetch_cisa(limit=10):
    """
    Fetches the latest known exploited vulnerabilities from CISA.
    Returns a list of simplified vulnerability dictionaries.
    """
    print("[*] Fetching CISA Known Exploited Vulnerabilities...")

    try:
        response = requests.get(CISA_URL, timeout=10)
        response.raise_for_status()  # Raises an error if request failed
        data = response.json()

        # The actual list of vulnerabilities is under the "vulnerabilities" key
        vulns = data.get("vulnerabilities", [])

        # Sort by dateAdded so we get the most recent ones first
        vulns_sorted = sorted(vulns, key=lambda x: x.get("dateAdded", ""), reverse=True)

        # Grab only the fields we care about
        results = []
        for vuln in vulns_sorted[:limit]:
            results.append({
                "cve_id":           vuln.get("cveID", "N/A"),
                "vendor":           vuln.get("vendorProject", "N/A"),
                "product":          vuln.get("product", "N/A"),
                "vulnerability":    vuln.get("vulnerabilityName", "N/A"),
                "date_added":       vuln.get("dateAdded", "N/A"),
                "due_date":         vuln.get("dueDate", "N/A"),
                "required_action":  vuln.get("requiredAction", "N/A"),
                "short_description": vuln.get("shortDescription", "N/A"),
            })

        print(f"    ✓ Retrieved {len(results)} CISA vulnerabilities.")
        return results

    except requests.exceptions.RequestException as e:
        print(f"    ✗ Error fetching CISA data: {e}")
        return []


# ── THE HACKER NEWS ───────────────────────────────────────────────
# The Hacker News publishes an RSS feed we can parse for free.
# feedparser handles all the RSS parsing for us.

THN_RSS_URL = "https://feeds.feedburner.com/TheHackersNews"

def fetch_hacker_news(limit=10):
    """
    Fetches the latest articles from The Hacker News RSS feed.
    Returns a list of article dictionaries.
    """
    print("[*] Fetching The Hacker News RSS feed...")

    try:
        feed = feedparser.parse(THN_RSS_URL)

        if feed.bozo:  # feedparser sets this flag if the feed had issues
            print("    ✗ Warning: RSS feed may have issues, trying anyway...")

        results = []
        for entry in feed.entries[:limit]:
            results.append({
                "title":     entry.get("title", "N/A"),
                "link":      entry.get("link", "N/A"),
                "published": entry.get("published", "N/A"),
                "summary":   entry.get("summary", "N/A"),
                "tags":      [tag.term for tag in entry.get("tags", [])],
            })

        print(f"    ✓ Retrieved {len(results)} Hacker News articles.")
        return results

    except Exception as e:
        print(f"    ✗ Error fetching Hacker News feed: {e}")
        return []


# ── MAIN COLLECTOR ────────────────────────────────────────────────
# This is the function that main.py will call.
# It runs both collectors and bundles the results together.

def collect_all(limit=10):
    """
    Runs all data collectors and returns a combined dictionary.
    `limit` controls how many items to fetch from each source.
    """
    print("\n========================================")
    print("  THREAT INTEL DATA COLLECTION STARTING")
    print("========================================\n")

    collected = {
        "collected_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "cisa_vulnerabilities": fetch_cisa(limit=limit),
        "hacker_news_articles": fetch_hacker_news(limit=limit),
    }

    print("\n[✓] Data collection complete.\n")
    return collected


# ── Quick test: run this file directly to see what gets collected ──
if __name__ == "__main__":
    import json
    data = collect_all(limit=5)
    print(json.dumps(data, indent=2))