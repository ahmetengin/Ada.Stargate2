
# 🧬 ADA STARGATE: MASTER BLUEPRINT FOR AI ARCHITECTS

**Target:** Gemini CLI / Cursor / Claude Code
**Architecture Reference:** [Big 3 Super Agent](https://github.com/disler/big-3-super-agent)
**Frontend Context:** "The Operations Deck" (React/TypeScript)

---

## 1. THE MISSION: "Orchestrating the Silence"

You are tasked with building the **Python Backend** for Ada Stargate.
The Frontend is already built. It is a rich, episode-filled "Mission Control" interface.
Your job is to build the **Backend Brain** that powers this interface using the **Big 3 Architecture**.

### The "Episode-Filled" Frontend
The Frontend is not just a chat. It operates in distinct **Operational Episodes**. Your backend must support these specific flows:

*   **Episode A (Welcome Home):**
    *   *Trigger:* `ada.marina` detects a vessel on AIS < 20nm.
    *   *Backend Task:* `MarinaExpert` calculates ETA, assigns a berth (Worker), and generates a "Proactive Hail" message.
*   **Episode B (Guardian Protocol):**
    *   *Trigger:* "Mayday" or "Fire" detected.
    *   *Backend Task:* `SecurityExpert` locks the API, activates "Red Mode", and streams casualty data.
*   **Episode C (Safety Net):**
    *   *Trigger:* Collision or damage report.
    *   *Backend Task:* `FinanceExpert` checks insurance expiry (Worker) and generates a renewal quote immediately.
*   **Episode J (Culinary):**
    *   *Trigger:* "Dinner at Poem".
    *   *Backend Task:* `TravelExpert` checks availability (Worker) and issues a PassKit reservation.

---

## 2. THE ARCHITECTURE: BIG 3 SUPER AGENT

You must structure the Python backend into three distinct layers of abstraction to ensure **Zero Error**.

### 🧠 Level 1: THE ORCHESTRATOR (Router)
*   **Identity:** `ada.marina.wim` (The Host)
*   **File:** `backend/main.py`
*   **Role:** The State Machine. It accepts the user prompt, maintains global state, and routes to the correct Expert.
*   **Tech:** FastAPI + Semantic Router (or LLM Router).

### 👔 Level 2: THE EXPERTS (Domain Logic)
*   **Identity:** `ada.finance`, `ada.legal`, `ada.marina`, `ada.travel`
*   **Files:** `backend/agents/*.py`
*   **Role:** They plan *how* to solve a problem. They do NOT guess math or data. They call Workers.
*   **Example:** `FinanceExpert` knows *that* an invoice needs to be calculated, but asks the `CalculatorWorker` to do the math.

### 🛠️ Level 3: THE WORKERS (Deterministic Execution)
*   **Identity:** The "Hands"
*   **Files:** `backend/workers/*.py`
*   **Role:** Pure code. No LLM. Zero Hallucination.
*   **Example:** `calculate_overstay_penalty(days, rate)` -> Returns exact float.

---

## 3. EXECUTION PLAN (GENERATE THESE FILES)

Please generate the following file structure to bring this architecture to life.

### A. Project Root & Dependencies
**File:** `backend/requirements.txt`
```text
fastapi>=0.109.0
uvicorn>=0.27.0
pydantic>=2.6.0
python-dotenv>=1.0.1
google-generativeai>=0.4.0
httpx>=0.26.0
redis>=5.0.0
chromadb>=0.4.22
```

### B. The Router (Level 1)
**File:** `backend/main.py`
```python
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.finance_agent import FinanceExpert
from agents.marina_agent import MarinaExpert
from agents.legal_agent import LegalExpert

app = FastAPI(title="Ada Stargate Backend", version="4.0")

# CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Experts
finance_agent = FinanceExpert()
marina_agent = MarinaExpert()
legal_agent = LegalExpert()

class ChatRequest(BaseModel):
    prompt: str
    user_role: str
    context: dict = {}

@app.post("/api/v1/chat")
async def chat_endpoint(request: ChatRequest):
    """
    The Big 3 Router.
    1. Analyzes Intent.
    2. Routes to Expert.
    3. Returns Structured Response.
    """
    prompt = request.prompt.lower()
    print(f"--> ROUTER RECEIVED: {prompt}")

    # --- ROUTING LOGIC ---
    
    # Episode B: Guardian Protocol
    if "mayday" in prompt or "fire" in prompt or "code red" in prompt:
        return await marina_agent.activate_guardian_protocol()

    # Episode C: Finance/Insurance
    if any(x in prompt for x in ["invoice", "debt", "pay", "insurance", "quote"]):
        return await finance_agent.process(prompt)

    # Episode A: Marina Ops
    if any(x in prompt for x in ["radar", "scan", "depart", "arrive", "hail"]):
        return await marina_agent.process(prompt)

    # Episode J: Legal/Contracts
    if any(x in prompt for x in ["contract", "law", "regulation", "sell", "transfer"]):
        return await legal_agent.process(prompt)

    # Fallback
    return {"text": "Ada Core: I heard you, but I am routing this to the General Log."}

# Agent Direct Skill Invocation (RPC for Dashboard Widgets)
@app.post("/api/v1/agent/{agent_name}/{skill_name}")
async def invoke_skill(agent_name: str, skill_name: str, params: dict):
    if agent_name == "marina" and skill_name == "get_telemetry":
        return marina_agent.get_telemetry(params.get('vessel_name'))
    
    if agent_name == "finance" and skill_name == "check_debt":
        return finance_agent.check_debt(params.get('vessel_name'))
        
    return {"error": "Skill not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### C. The Experts (Level 2)

**File:** `backend/agents/marina_agent.py`
```python
import random

class MarinaExpert:
    """
    Expert for Marina Operations, Traffic Control, and Emergency Protocols.
    """
    async def process(self, prompt: str):
        if "depart" in prompt:
            # Logic: Call Worker to check weather, then check traffic
            return {
                "text": "**DEPARTURE REQUEST**\n\nATC Checks Complete.\n- Weather: Clear\n- Sector Zulu: Open\n\n**Authorized.** Monitor Ch 14.",
                "actions": [{"source_node": "ada.marina", "action_type": "UPDATE_TRAFFIC", "params": {"status": "OUTBOUND"}}]
            }
        if "radar" in prompt:
            return {
                "text": "**RADAR SCAN COMPLETE**\n3 Targets detected in 5nm radius.",
                "data": {"targets": ["S/Y Phisedelia", "M/V MSC Gulsun"]}
            }
        return {"text": "Marina Expert standing by."}

    async def activate_guardian_protocol(self):
        return {
            "text": "**🚨 CODE RED ACTIVATED**\n\nGuardian Protocol initiated.\n- Fire Tenders Dispatched\n- Radio Silence Enforced\n- Casualty Tracking Active",
            "actions": [
                {"source_node": "ada.security", "action_type": "TOGGLE_RED_ALERT", "params": {"active": True}}
            ]
        }

    def get_telemetry(self, vessel_name):
        # Worker Logic (Simulation)
        return {
            "battery": {"serviceBank": 25.2, "status": "DISCHARGING"},
            "tanks": {"fuel": 65, "freshWater": 90}
        }
```

**File:** `backend/agents/finance_agent.py`
```python
class FinanceExpert:
    """
    Expert for Accounts, Invoicing, and Insurance.
    """
    async def process(self, prompt: str):
        if "debt" in prompt:
            # Worker Call: Database Lookup
            debt = 850.00
            return {
                "text": f"**FINANCIAL STATUS**\nOutstanding Balance: **€{debt}**\nStatus: **PAYMENT REQUIRED**",
                "actions": []
            }
        if "insurance" in prompt:
            # Episode C: Upsell
            return {
                "text": "**INSURANCE QUOTE GENERATED**\nPartner: Turk P&I\nPremium: €1,200/yr\n\n*Would you like to bind this policy?*"
            }
        return {"text": "Finance Expert listening."}

    def check_debt(self, vessel_name):
        # Worker Logic
        return {"balance": 850.00, "currency": "EUR", "payment_history_status": "RECENTLY_LATE"}
```

**File:** `backend/agents/legal_agent.py`
```python
class LegalExpert:
    """
    Expert for RAG (Regulations) and Contract Logic.
    """
    async def process(self, prompt: str):
        if "sell" in prompt or "transfer" in prompt:
            # Logic: Check Article E.2.19
            return {
                "text": "**LEGAL ADVISORY: VESSEL SALE**\n\nReference: **Article E.2.19**\n- Contracts are NON-TRANSFERABLE.\n- Current contract will terminate upon sale.\n- New owner must sign a new contract within 7 days.\n\n*Do you require a 'No Debt Letter' for the transfer?*"
            }
        return {"text": "Legal Expert ready."}
```

---

## 4. DEPLOYMENT (DOCKER)

**File:** `backend/Dockerfile`
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

**Action:**
Run `docker-compose up --build` to launch the Brain.
The Frontend will automatically connect via `services/api.ts`.

