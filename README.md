# AI Threat Intelligence Agent

## Overview

The AI Threat Intelligence Agent is designed to automate the collection, analysis, and reporting of threat intelligence data from open-source intelligence (OSINT) feeds. The system helps reduce the manual workload required to monitor vulnerabilities, security news, and emerging cyber threats.

---

## Problem Statement

Cybersecurity teams are overwhelmed by the large amount of threat intelligence published daily across multiple sources. Manually monitoring and prioritizing threats is time-consuming, difficult to scale, and prone to human error.

Organizations need a centralized system that can:

- Continuously monitor OSINT sources
- Identify and prioritize critical threats
- Generate actionable threat intelligence reports automatically

---

## Our Solution

Our platform automates the threat intelligence workflow by:

- Collecting data from sources such as the CISA KEV Catalog and The Hacker News
- Processing and normalizing threat data
- Using AI to analyze threats and assign risk scores
- Generating structured JSON reports
- Providing a lightweight Flask-based dashboard for analysts

---

## Technical Design

The project follows a modular pipeline-based architecture with four main layers:

1. **Data Collection** – Python scripts gather data from OSINT feeds and APIs
2. **Processing & Analysis** – Threat data is cleaned, validated, and prioritized using AI
3. **Storage** – Processed threat intelligence is stored in a local database
4. **Presentation** – A Flask dashboard allows users to search, filter, and review reports
