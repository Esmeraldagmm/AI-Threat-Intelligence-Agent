# AI Threat Intelligence Dashboard

## Overview

The AI Threat Intelligence Dashboard is designed to automate the collection, analysis, and reporting of threat intelligence data from open-source intelligence (OSINT) feeds. The system helps reduce the manual workload required to monitor vulnerabilities, security news, and emerging cyber threats.

---

## Problem Statement

Cybersecurity analysts are overwhelmed by the large amount of threat intelligence published daily across multiple sources. Manually monitoring and prioritizing threats is time-consuming, difficult to scale, and prone to human error.

---

## Solution

The platform automates the threat intelligence pipeline:

- Collects data from OSINT sources (CISA KEV, The Hacker News)
- Processes and normalizes raw threat data
- Uses AI analysis to assign risk scores and generate summaries
- Outputs structured JSON threat reports
- Displays results in an interactive Next.js dashboard

---

### Tech Stack

**Backend:**

- **Python** – Language for data collection and analysis
- **FastAPI** – REST API framework for serving threat data
- **Groq API** – AI-powered threat analysis and risk scoring
- **Requests** – HTTP library for consuming OSINT feeds
- **JSON** – Data format for threat reports

**Frontend:**

- **Next.js** – React-based framework for server-side rendering and static generation
- **TypeScript** – Type-safe JavaScript for improved code quality
- **Tailwind CSS** – Utility-first CSS framework for responsive styling
- **shadcn/ui** – React component library
- **Lucide React** – Consistent SVG icon set
- **React Hooks** – State management and side effects

---

## Getting Started

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **npm or yarn** (for Node.js package management)
- **Groq API Key** (for AI analysis) – Get one at [console.groq.com](https://console.groq.com)

### Setup & Running Instructions

#### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Create a Python virtual environment and install dependencies:**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Create environment variables file:**
   Create a `.env` file in the `backend/` directory with your Groq API key:

   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

   This key is required for AI-powered threat analysis.

4. **Generate a threat intelligence report:**

   ```bash
   python3 main.py # This will collect OSINT data, run AI analysis, and write a JSON file into backend/reports/
   ls -la reports/ # Verify report was saved into backend/reports/
   ```

5. **Start FastAPI server:**
   Run

   ```bash
   pip install "uvicorn[standard]"
   uvicorn api:app --reload --port 8000
   ```

6. **Verify API is running:**
   In the browser, open `http://127.0.0.1:8000/api/reports/latest`
   You should see the latest generated JSON threat report.

#### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Verify Next.js application is running**
   Open your browser and navigate to `http://localhost:3000`

### Main Functionality

Once both services are running:

1. **View Executive Summary** – The dashboard opens showing a high-level overview of threat statistics:
   - Total threats identified
   - Overall risk level
   - Number of critical threats
   - Active threat sources

2. **Explore Threats** – Click the "Threats" tab to see:
   - List of identified threats with risk scores
   - Filter threats by risk level or source
   - Expand individual threats to see details, recommendations, and reference links

3. **Review Analytics** – Click the "Analytics" tab to see:
   - Bar chart showing threat severity distribution
   - Bar chart showing threat types and their frequency
   - Source breakdown (CISA, Hacker News, etc.)

4. **Check Recommended Actions** – Click the "Actions" tab to view:
   - Prioritized recommendations based on risk
   - Indicators of Compromise (CVE IDs, affected vendors)
   - Actionable security measures

5. **Refresh Data** – Click the "Refresh" button in the header to:
   - Trigger a new data collection cycle
   - Update threat analysis with latest OSINT data
   - Regenerate the report
