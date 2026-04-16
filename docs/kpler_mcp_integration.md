# 📡 Kpler MCP API Integration & Ada Agent Skills

**Reference:** [Kpler Developer Ecosystem - MCP](https://developers.kpler.com/ecosystem/mcp)

---

## 1. Overview

To elevate Ada's maritime intelligence from static databases to live, rich, and dynamic data streams, we have integrated **Kpler's** **MCP (Model Context Protocol)** style APIs. This integration transforms Ada from a simple monitor into a proactive maritime intelligence analyst.

This document explains which Kpler APIs Ada uses, the data models from these APIs, and how this data is processed by our agents.

---

## 2. API Endpoints and Data Models

The Ada ecosystem simulates and uses two fundamental Kpler MCP endpoints:

### A. Live Regional AIS Feed

This endpoint feeds the live radar display on the "Operations Deck," reflecting the real-time status of marina operations.

*   **Endpoint:** `https://api.kpler.com/v1/ais/wim-region/live`
*   **Purpose:** To monitor all vessel movements in real-time within the WIM (West Istanbul Marina) and its approach sectors.
*   **Sample Data Model (`KplerAisTarget`):**
    ```json
    {
      "id": "kpler-987654321",
      "vessel_name": "S/Y Phisedelia",
      "status": "DOCKED",
      "latitude": 40.9634,
      "longitude": 28.6289,
      "speed_knots": 0.1,
      "course_deg": 185
    }
    ```

### B. Vessel Intelligence Profile

This endpoint provides in-depth information about a specific vessel, offering strategic context beyond simple location tracking.

*   **Endpoint:** `https://api.kpler.com/v1/vessels/details?imo={imo}`
*   **Purpose:** To generate detailed vessel briefings in response to user queries (e.g., "intel on Phisedelia").
*   **Sample Data Model (`VesselIntelligenceProfile`):**
    ```json
    {
      "name": "M/Y Grand Turk",
      "imo": "777888999",
      "type": "Superyacht",
      "flag": "PA",
      "dwt": 650,
      "loa": 45.0,
      "beam": 9.0,
      "status": "DOCKED",
      "location": "VIP Quay",
      "voyage": {
        "lastPort": "St. Tropez",
        "nextPort": "WIM",
        "eta": "N/A"
      }
    }
    ```

---

## 3. Ada Agent Integration

These rich data streams are processed by Ada's expert agents through dedicated "skills":

*   **`marinaAgent.fetchLiveAisData()`:**
    *   **Task:** Periodically calls the live AIS endpoint (every 15 seconds).
    *   **Function:** Transforms the incoming raw Kpler data into the standard `TrafficEntry` format used by the application. This ensures the UI layer always works with a consistent data structure.
    *   **Result:** The radar on the "Operations Deck" remains constantly updated.

*   **`marinaAgent.getVesselIntelligence()`:**
    *   **Task:** Triggered by the `orchestratorService` when keywords like "intel," "briefing," or "details" are detected.
    *   **Function:** Queries Kpler's detail endpoint with the specified vessel's IMO or name and returns a complete `VesselIntelligenceProfile`.
    *   **Result:** A professional intelligence briefing is presented to the user in Markdown format.

*   **`orchestratorService` Logic:**
    *   The orchestrator analyzes incoming user prompts to distinguish whether the request is for a general AIS view or a specific vessel query, and calls the appropriate `marinaAgent` skill.

---

## 4. Strategic Impact

This integration significantly enhances Ada's capabilities:
1.  **From Reactive to Proactive:** Instead of just showing what is, it gains the ability to predict "what might be" with information like a vessel's origin and destination.
2.  **Operational Awareness:** Knowing that a point on the radar is not just a vessel, but a "24-meter motor yacht arriving from Monaco," improves decision-making processes.
3.  **"Code-First" Paradigm:** The data source becomes a well-defined, code-based "skill" used by the agents. This increases the system's flexibility and scalability.

Hopefully!