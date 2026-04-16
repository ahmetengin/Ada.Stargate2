# 🗺️ Architecture Roadmap: Ada Stargate v4.0

**Status:** Analysis Complete
**Target Architecture:** [Big 3 Super Agent](https://github.com/disler/big-3-super-agent) (Python/FastAPI + LangGraph)

## 🔴 Priority 0: Critical Security & Infrastructure
*Goal: Secure the foundation before scaling.*

- [ ] **Secure API Key Storage**: 
    - Current State: `API_KEY` is injected into the Frontend bundle via `docker-compose` or `.env`.
    - **Action**: Move all Gemini API calls to a Python Proxy / Backend. The client should NEVER see the `API_KEY`.
- [ ] **CI/CD Pipeline**: 
    - **Action**: Add GitHub Actions for `npm run build` and `docker build` to prevent regression.

## 🟠 Priority 1: The "Big 3" Backend Migration
*Goal: Move logic from Browser (Fragile) to Server (Robust).*

### 1.1 Orchestrator Migration
- [ ] **Initialize LangGraph**: Implement the state machine in `backend/orchestrator/graph.py` to replace the `if/else` logic in `orchestratorService.ts`.
- [ ] **Route Handling**: Create a Semantic Router in Python to classify intents (e.g., `DEPARTURE_REQUEST` vs `INVOICE_QUERY`) more accurately than the current regex approach.

### 1.2 Expert Node Implementation (FastMCP)
- [ ] **ada.finance**: Port `financeAgent.ts` logic to a Python FastMCP server.
    - *Task:* Implement `calculate_invoice` and `check_debt` as deterministic Python functions.
- [ ] **ada.marina**: Port `marinaAgent.ts` logic.
    - *Task:* Move `scanSector` radar logic to a server-side Kpler API wrapper.
- [ ] **ada.legal**: Connect `legalAgent.ts` RAG logic to a Qdrant vector store instead of in-memory Markdown parsing.

### 1.3 Frontend Integration
- [ ] **API Switch**: Update `services/api.ts` to handle streaming SSE (Server-Sent Events) from LangGraph for real-time "Thinking" logs.
- [ ] **Cleanup**: Deprecate and remove the local mock data arrays in `services/agents/*.ts` once the backend is live.

## 🟡 Priority 2: Data & State Persistence
*Goal: Enterprise-grade reliability.*

- [ ] **Database Migration**:
    - [ ] Replace `services/persistence.ts` (LocalStorage) with **PostgreSQL** for Entity Storage (Vessels, Invoices, Users).
    - [ ] Implement **Redis** for Hot State (Conversation History, Event Bus).
- [ ] **Dynamic Configuration**:
    - [ ] Migrate `wimMasterData.ts` to a database or YAML config loaded at runtime to support multi-tenant deployments (e.g., Alesta vs. WIM).

## 🔵 Priority 3: Observability & Compliance
*Goal: "Glass Box" AI and Legal Safety.*

- [ ] **Event Bus**: Fully implement the Redis Pub/Sub system defined in `docs/architecture/OBSERVABILITY_HOOKS.md` to stream backend logs to the Frontend `AgentTraceModal`.
- [ ] **Audit Logs**: Ensure every "Action" (e.g., `ada.finance.invoiceCreated`) is written to an immutable audit log for financial compliance.

## 🟢 Priority 4: Feature Hardening & UX

- [ ] **Voice Protocol**: Optimize `LiveSession` in `liveService.ts` to handle interruptions better (VHF "Break Break" logic).
- [ ] **Identity Verification**: Replace the simulated `PassportScanner.tsx` logic with a real server-side OCR implementation (Tesseract or Google Vision API).
- [ ] **Performance**: Implement virtualization (e.g., `react-window`) for the `Canvas.tsx` Operations Feed to handle 1000+ log entries efficiently.
- [ ] **Offline Sync**: Implement a Service Worker to allow basic "Read-Only" access to `wim_contract_regulations.md` when offline at sea.