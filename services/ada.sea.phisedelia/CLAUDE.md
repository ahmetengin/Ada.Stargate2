# Ada.sea.Phisedelia – Tenant Constitution (v1)

## 1. Identity
This service represents the tenant: **S/Y Phisedelia** (Autonomous Racing Yacht).
It operates under the **Tactical Agentic Coding (TAC)** doctrine.

## 2. Mission
To ensure S/Y Phisedelia's autonomous operation in open ocean racing, prioritizing performance, safety, and strict compliance with COLREGs and race rules.

## 3. Source of Truth
- **Tactical Spec:** `docs/tactical/Ada.sea.Phisedelia-Tactical-Spec.md`
- **Hard Rules:** `config/sea_phisedelia_rules.yaml`

## 4. Code Rules
- **Python 3.11+**
- **FastAPI** for API layer (if remote comms are needed)
- **Pydantic** for schemas (Zero Error)
- **MCP** for tool exposure
- **MicroPython/C++** for low-latency sensor/actuator control

## 5. Development Protocol
1.  **Read Spec:** Check `Ada.sea.Phisedelia-Tactical-Spec.md` before new features.
2.  **Check Rules:** Verify constants against `sea_phisedelia_rules.yaml`.
3.  **Plan:** Summarize the change.
4.  **Execute:** Write code.

## 6. Directory Structure
- `api/`: FastAPI routes (for external comms)
- `schemas/`: Pydantic models for NMEA, AIS, etc.
- `services/`: Business logic (The Agents)
- `config/`: Configuration files (e.g., polar diagrams)
- `rag/`: Document ingestion (COLREGs, Race Rules)
- `telemetry/`: NMEA2000 / SignalK integration layer