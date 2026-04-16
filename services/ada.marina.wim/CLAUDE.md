# Ada.Marina.WIM – Tenant Constitution (v1)

## 1. Identity
This service represents the tenant: **West Istanbul Marina (WIM)**.
It operates under the **Tactical Agentic Coding (TAC)** doctrine.

## 2. Mission
To automate operational flows (entry/exit, berthing, security, billing) semi-autonomously.

## 3. Source of Truth
- **Tactical Spec:** `docs/tactical/Ada.marina.WIM-Tactical-Spec.md`
- **Hard Rules:** `config/marina_wim_rules.yaml`

## 4. Code Rules
- **Python 3.11+**
- **FastAPI** for API layer
- **Pydantic** for schemas (Zero Error)
- **MCP** for tool exposure

## 5. Development Protocol
1.  **Read Spec:** Check `Ada.marina.WIM-Tactical-Spec.md` before new features.
2.  **Check Rules:** Verify constants against `marina_wim_rules.yaml`.
3.  **Plan:** Summarize the change.
4.  **Execute:** Write code.

## 6. Directory Structure
- `api/`: FastAPI routes
- `schemas/`: Pydantic models
- `services/`: Business logic (The Agents)
- `config/`: Configuration files
- `rag/`: Document ingestion
- `db/`: Database models
