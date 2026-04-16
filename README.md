
# ⚓️ ADA - MARITIME INTELLIGENCE

<div align="center">

![System Status](https://img.shields.io/badge/SYSTEM-OPERATIONAL-success?style=for-the-badge&logo=radar)
![AI Core](https://img.shields.io/badge/AI_CORE-GEMINI_PRO_3.0-purple?style=for-the-badge&logo=google-gemini)
![Nodes](https://img.shields.io/badge/FLEET_NODES-602_ACTIVE-blue?style=for-the-badge&logo=docker)
![Architecture](https://img.shields.io/badge/ARCH-AUDIT_PASSED-orange?style=for-the-badge&logo=blueprint)

```text
    _    ____      _    
   / \  |  _ \    / \   
  / _ \ | | | |  / _ \  
 / ___ \| |_| | / ___ \ 
/_/   \_\____/ /_/   \_\
                        
[ ORCHESTRATING THE SILENCE OF THE SEA ]
```

**"You weren't there then. But you are now, and Ada is scaling that experience."**

</div>

---

## 🗺️ Architectural Roadmap
**Critical Update:** The system is currently transitioning from v3.2 (Frontend Simulation) to v4.0 (Enterprise Backend).
Please review the **[Architectural Roadmap & Todo List](./ROADMAP.md)** for the detailed migration plan, including Security, Persistence, and the "Big 3" Agent architecture.

---

## 🌊 What is Ada?

Ada is not just a chatbot. It is a **living, breathing, distributed multi-agent ecosystem** designed for the maritime world. 

It simulates a massive network of **600+ autonomous vessels** docked at **West Istanbul Marina (WIM)**. Each vessel is a silent, privacy-first node (`ada.sea.*`), communicating with the central Orchestrator (`ada.marina.wim`) only when necessary.

It listens to the radio. It manages finances. It predicts the weather. It enforces the law. It protects the captain.

## 🚀 Mission Control Capabilities

### 📡 The "VHF Sentinel" (Always Listening)
Ada doesn't just read text; she **listens**. 
*   **Real-time Audio Analysis:** Monitors **Channel 72 (Marina)** and **Channel 16 (Emergency)** 24/7.
*   **Speech-to-Action:** Transcribes radio chatter, detects "MAYDAY" or "PAN PAN" signals, and instantly alerts the operations desk.
*   **Visualizer:** A specialized VHF HUD for the operator.

### 🚢 Maritime Intelligence (MCP & Kpler)
*   **Live AIS Radar:** Integrates with **Kpler's MCP** to visualize real-time traffic in the Canvas map.
*   **Vessel Profiling:** Automatically fetches deep intelligence (IMO, Flag, Voyage) for any vessel entering the sector.
*   **Proactive ATC:** Detects inbound contracted vessels and pre-assigns tenders before they even call in.

### 💶 Financial Autonomy (Parasut & Iyzico)
*   **Debt Protocol:** Checks outstanding balances via **Parasut** (Simulated) before authorizing departure.
*   **Automated Invoicing:** Generates invoices and secure **Iyzico** payment links on the fly.
*   **Bank Reconciliation:** Simulates daily settlement reports from **Garanti BBVA** API to clear debts and update loyalty scores.

### ⚖️ Legal Authority (RAG & SEAL)
*   **Regulation Expert:** Ingests WIM Contracts, COLREGs, and Turkish Maritime Law into a RAG Knowledge Graph.
*   **Self-Adapting:** Uses **SEAL (Self-Adapting Language Models)** architecture to "learn" new rules and generate synthetic enforcement scenarios.
*   **KVKK/GDPR Compliance:** Strictly enforces data privacy, masking PII (Names, IDs) in all logs and outputs.

### 🧠 The "Brain" (Gemini 3.0 Pro)
*   **Reasoning Engine:** Utilizing Google's latest **Gemini 3.0 Pro** with deep thinking enabled.
*   **Context Aware:** Knows the difference between a 40ft Catamaran and a 90ft Superyacht.
*   **Hybrid Architecture:** Combines raw telemetry (battery, wind) with high-level reasoning.

## 🏗️ Next-Gen Architecture (Python Migration)

Ada is evolving from a frontend simulation to a "Zero Error" Python backend.

*   **[Big 3 Architecture Migration](./docs/architecture/NEXT_GEN_MIGRATION.md)**: Moving to LangGraph & FastMCP.
*   **[Observability & Code Hooks](./docs/architecture/OBSERVABILITY_HOOKS.md)**: The "Glass Box" protocol for real-time event streaming.
*   **[Python Stack Setup](./docs/architecture/PYTHON_STACK_SETUP.md)**: FastAPI, Pydantic AI, and Redis configuration.

## 📟 The Interface: "Operations Deck"

The UI is built like a modern **Agentic IDE**.
*   **Left Wing:** Sidebar controls & VHF Tuner.
*   **Center Stage:** The Agent Chat (Orchestrator).
*   **Right Wing (Canvas):** The **Live Event Bus**. A Matrix-style feed of fleet operations, live AIS radar, and financial logs.

---

## 🛠️ Tech Stack (Current v3.2)

*   **Core:** React 18 + TypeScript + Tailwind CSS
*   **Intelligence:** Google GenAI SDK (Gemini 3.0 Pro & 2.5 Flash)
*   **Voice:** Web Audio API + Gemini Live (WebSocket Streaming)
*   **Infrastructure:** Docker (Multi-stage) + Nginx
*   **Simulation:** Custom-built Node Event Emitter Engine

---

## ⚡️ Quick Start

Want to wake the giant?

```bash
# 1. Clone the frequency
git clone https://github.com/ahmetengin/Ada-Stargate.git

# 2. Inject the soul (API Key)
# Create a .env file and add your Google AI Studio API key
# API_KEY=AIzaSyYourActualKeyHere...

# 3. Launch the fleet (Docker)
docker-compose up -d --build
```

> *For detailed manual instructions, check [INSTALL.md](./INSTALL.md).*

---

## 💙 Dedication

This project is built with passion for the sea, code, and the future of autonomous agents. 

**Ada** is dedicated to every Captain who has ever navigated through a storm, waiting for a calm voice on the radio.

> *Fair winds and following seas.*

---
<div align="center">
  <sub>Designed & Engineered by <b>Ahmet Engin</b> with ❤️</sub>
</div>