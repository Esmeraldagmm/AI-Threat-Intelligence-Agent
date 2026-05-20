# AI Threat Intelligence Dashboard

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
- Providing an interactive Next.js dashboard for analysts

---

## Technical Design

The project follows a modular pipeline-based architecture with four main layers:

1. **Data Collection** – Python scripts gather data from OSINT feeds and APIs
2. **Processing & Analysis** – Threat data is cleaned, validated, and prioritized using AI
3. **Storage** – Processed threat intelligence is stored in a local database
4. **Presentation** – A Next.js React dashboard allows users to search, filter, and review reports

### Tech Stack

**Backend:**

- **Python** – Language for data collection and analysis
- **FastAPI** – REST API framework for serving threat data
- **Groq API** – AI-powered threat analysis and risk scoring
- **Requests** – HTTP library for consuming OSINT feeds
- **JSON** – Data format for threat reports

**Data Sources:**

- CISA
- The Hacker News

**Frontend:**

- **Next.js** – React-based framework for server-side rendering and static generation
- **TypeScript** – Type-safe JavaScript for improved code quality
- **Tailwind CSS** – Utility-first CSS framework for responsive styling
- **shadcn/ui** – React component library
- **Lucide React** – Consistent SVG icon set
- **React Hooks** – State management and side effects

---

## How It Works

1. **Data Collection Phase** – The backend connects to CISA and Hacker News APIs to fetch the latest threat data
2. **AI Analysis Phase** – Groq AI processes each threat to generate risk scores (0-100) and detailed risk justifications
3. **Report Generation** – Analyzed threats are compiled into a structured JSON report with executive summary and recommendations
4. **Dashboard Display** – The Next.js frontend displays the report in an interactive dashboard with:
   - Executive summary with risk statistics
   - Threat list with risk levels and details
   - Analytics showing threat distribution and severity trends
   - IOC (Indicators of Compromise) summary
   - Recommended actions prioritized by risk

---

## Getting Started

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **npm or yarn** (for Node.js package management)
- **Groq API Key** (for AI analysis) – Get one at [console.groq.com](https://console.groq.com)

### Setup & Installation

#### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Create a Python virtual environment:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file in the `backend/` directory with your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

#### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the API endpoint:**
   The frontend is configured to connect to `http://localhost:8000` by default. If running on a different port, update the API configuration in the frontend code.

### Running the Application

#### Start the Backend

1. From the `backend/` directory (with virtual environment activated), start the FastAPI server:

   ```bash
   uvicorn api:app --reload
   ```

   The API will be available at `http://localhost:8000` with endpoint `GET /api/reports/latest` to fetch threat reports

2. To generate threat reports, in another terminal run:
   ```bash
   python main.py
   ```
   This collects data from OSINT sources and performs AI analysis, saving the report to `/reports`

#### Start the Frontend

1. From the `frontend/` directory in a new terminal:

   ```bash
   npm run dev
   ```

   The Next.js application will start on `http://localhost:3000`

2. Open your browser and navigate to `http://localhost:3000`

### Demonstrating Main Functionality

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
