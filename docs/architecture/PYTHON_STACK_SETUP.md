
# 🐍 Ada Backend: Python Enterprise Stack Setup

**Goal:** Migrate from the Frontend Simulation to a "Big 3" Production Backend.

## 1. Core Technology Stack

| Component | Library | Purpose |
| :--- | :--- | :--- |
| **API Framework** | `FastAPI` | High-performance Async I/O for serving the Orchestrator. |
| **Agent Runtime** | `LangGraph` | Stateful orchestration, cycles, and persistence (The Brain). |
| **MCP Server** | `FastMCP` | Building the Expert Nodes (`ada.finance`, `ada.legal`). |
| **Validation** | `Pydantic AI` | "Zero Error" structured outputs and tool definitions. |
| **Memory** | `Redis` | Hot storage for conversation state and Event Bus. |
| **Vector DB** | `Qdrant` | RAG storage for `ada.legal` documents. |
| **Database** | `PostgreSQL` | Persistent entity storage (Invoices, Vessels). |

## 2. Folder Structure (The "Big 3" Pattern)

This structure enforces separation of concerns.

```text
backend/
├── main.py                  # FastAPI Entry Point (Webhooks & Chat Endpoint)
├── config.py                # Environment Variables
│
├── orchestrator/            # LEVEL 1: THE ROUTER (LangGraph)
│   ├── graph.py             # The State Graph definition
│   ├── state.py             # Pydantic models for Graph State
│   └── router.py            # Logic to select the next Expert
│
├── nodes/                   # LEVEL 2: THE EXPERTS (MCP Servers)
│   ├── finance/
│   │   ├── server.py        # FastMCP Server
│   │   └── tools.py         # Pydantic AI Tool Definitions
│   ├── legal/
│   │   ├── server.py
│   │   └── rag_engine.py    # Qdrant Integration
│   └── marina/
│       └── server.py
│
├── workers/                 # LEVEL 3: THE HANDS (Pure Logic)
│   ├── calculators.py       # Pure Python math (Penalty calc, Tax calc)
│   └── scrapers.py          # Kpler/MarineTraffic scrapers
│
└── hooks/                   # OBSERVABILITY
    ├── emitter.py           # Redis Publisher
    └── middleware.py        # Automatic tracing for requests
```

## 3. Getting Started

### A. Initialize Project
```bash
mkdir backend
cd backend
python3 -m venv venv
source venv/bin/activate
```

### B. Install Dependencies
Create `requirements.txt`:
```text
fastapi
uvicorn
langgraph
langchain-google-genai
fastmcp
pydantic-ai
redis
qdrant-client
asyncpg
```

```bash
pip install -r requirements.txt
```

### C. Run the Event Bus (Redis)
```bash
docker run -d -p 6379:6379 redis
```

### D. Start the Brain
```bash
uvicorn main:app --reload
```

## 4. The "Zero Error" Workflow

1.  **Define Types:** Create a Pydantic model for the expected output (e.g., `InvoiceSchema`).
2.  **Write the Worker:** Write a pure Python function `calculate_invoice` that passes unit tests.
3.  **Wrap in MCP:** Expose this function via `FastMCP` in `nodes/finance`.
4.  **Orchestrate:** Add a node in `LangGraph` that calls this MCP tool.
5.  **Validate:** Use `Pydantic AI` to ensure the LLM's input to the tool matches the schema strictly.
