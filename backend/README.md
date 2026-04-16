# 🐍 Ada Stargate Backend (v4.0 POC)

This is the **Enterprise Python Backend** for Ada Stargate. It implements the **"Big 3 Super Agent"** architecture (Router -> Expert -> Worker) using **FastAPI**.

## 🏗 Architecture

1.  **Router**: Uses Gemini Pro (or heuristic fallback) to classify intents (Finance, Legal, Tech).
2.  **Experts**: Specialized classes (`FinanceExpert`, `LegalExpert`) that handle domain logic.
3.  **Workers**: Pure, deterministic functions (`calculate_invoice`) ensuring "Zero Error" math.
4.  **API**: Exposes `POST /api/v1/chat` for the React Frontend.

## 🚀 Setup & Run

### 1. Install Requirements
```bash
cd backend
pip install -r requirements.txt
```

### 2. Set API Key
Create a `.env` file in the `backend/` folder:
```properties
API_KEY=AIzaSyYourGeminiKeyHere
```

### 3. Run the Server
```bash
python server.py
```
*Server will start at `http://localhost:8000`.*

## 🔗 Connecting to Frontend
Once this server is running, you can update `services/orchestratorService.ts` in the React app to fetch from `http://localhost:8000/api/v1/chat` instead of running local logic.
