# ⚓️ Ada - Maritime Intelligence Ecosystem

**Ada** is an AI-powered, multi-agent orchestrator designed for the maritime and hospitality industry. It simulates a distributed network of autonomous nodes (Vessels, Marina Operations, Finance, Legal) and provides a "Mission Control" interface for real-time operations.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (v18 or higher)
*   **npm** (v9 or higher)
*   **Docker** & **Docker Compose** (Optional, for containerized deployment)
*   **Google AI Studio API Key** (Required for Gemini 2.5/3.0 models)
    *   Get one here: [aistudio.google.com](https://aistudio.google.com/)

---

## 🚀 Quick Start (Local Development)

This project uses browser-native ES modules and a simple static server.

### 1. Clone the Repository
```bash
git clone https://github.com/ahmetengin/Ada-Stargate.git
cd Ada-Stargate
```

### 2. Configure Environment
Create a file named `.env` in the root directory and add your API key.

```properties
# .env
API_KEY=AIzaSyYourActualKeyHere...
```
*Note: This is a simplified setup for local development. The API key will be exposed on the client-side.*

### 3. Install a simple HTTP server
If you don't have one, `serve` is a good option.
```bash
npm install -g serve
```

### 4. Run the Application
Start the server from the project root.
```bash
serve .
```
The application will launch at `http://localhost:3000` (or another available port).

---

## 🐳 Docker Deployment (Production Ready)

Ada is container-ready with a multi-stage Docker build that serves the application via Nginx.

### 1. Setup Environment
Ensure your `.env` file exists and contains a valid `API_KEY` as shown above. The Docker build process extracts this key to embed it into the frontend application.

### 2. Build and Run
Use Docker Compose to orchestrate the frontend and the simulated Redis broker.

```bash
docker-compose up -d --build
```

*   **`--build`**: Forces a rebuild of the image (critical to inject the API Key if changed).
*   **`-d`**: Runs containers in detached mode (background).

### 3. Access the Dashboard
Open your browser and navigate to:
`http://localhost:3000`

### 4. Stop Services
```bash
docker-compose down
```

---

## 🧠 System Architecture

### Core Nodes
The system simulates communication between the following autonomous nodes:
*   `ada.marina.wim` (Orchestrator)
*   `ada.sea.<vessel>` (Autonomous Vessels - Privacy First)
*   `ada.vhf.wim` (Voice Sentinel - Ch 73/16)
*   `ada.finance.wim` (Accounting & Usage)

### Key Features
*   **VHF Radio Mode**: Real-time Speech-to-Speech interface using Gemini Live API.
*   **Mission Control (Canvas)**: Real-time log feed of fleet operations.
*   **Privacy Protocol**: Vessel data is local-first; telemetry is not broadcast without Captain authorization.

---

## ⚠️ Troubleshooting

**Issue: "Quota Exceeded / 429 Error"**
*   **Cause**: You have hit the rate limit for the Google Gemini API.
*   **Fix**: Wait for a minute or check your billing status at Google AI Studio. The app simulates a "System Alert" when this happens.

**Issue: Microphone not working**
*   **Cause**: Browser permissions denied.
*   **Fix**: Click the lock icon in your browser address bar and allow Microphone access for `localhost`.

**Issue: Docker build fails on API Key**
*   **Cause**: The `.env` file is missing or empty.
*   **Fix**: Ensure `.env` is in the root directory and contains `API_KEY=...`.