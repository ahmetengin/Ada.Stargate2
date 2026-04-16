# Contributing to Ada

First off, thank you for considering contributing to Ada! Ada is a complex, AI-powered multi-agent ecosystem designed for the maritime and hospitality industry. It relies on a distributed node mesh and a combination of modern web technologies and Python-based AI agents.

This document provides guidelines and instructions for contributing to the project.

## Table of Contents
1. [Development Environment Setup](#development-environment-setup)
2. [Coding Standards](#coding-standards)
3. [Submitting Bug Reports](#submitting-bug-reports)
4. [Proposing New Features](#proposing-new-features)
5. [Pull Request Process](#pull-request-process)

---

## Development Environment Setup

Ada consists of a TypeScript/React frontend and a Python-based backend for agent orchestration and MCP (Model Context Protocol) integrations.

### Prerequisites
* **Node.js** (v18 or higher)
* **Python** (v3.10 or higher)
* **Git**
* **Docker & Docker Compose** (optional, for running isolated services)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/ada.git
cd ada
```

### 2. Frontend Setup
The frontend is built with React, Vite, and Tailwind CSS.

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.template .env
# Edit .env and add your GEMINI_API_KEY and other required keys

# Start the development server (runs on port 3000)
npm run dev
```

### 3. Backend Setup
The backend houses the multi-agent ecosystem and Python workers.

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add required API keys (Gemini, Kpler, etc.)

# Run the backend server
python server.py
```

---

## Coding Standards

To maintain a healthy and scalable codebase, please adhere to the following standards:

### Frontend (TypeScript / React)
* **Frameworks:** Use functional components and React Hooks. Avoid class components.
* **Styling:** Use Tailwind CSS utility classes. Do not write custom CSS unless absolutely necessary (and place it in `index.css`).
* **Type Safety:** Use strict TypeScript. Avoid `any` wherever possible. Define clear interfaces in `types.ts` or adjacent to your components.
* **Architecture:** Keep components small and focused. Place reusable UI components in `components/` and agent-specific logic in `services/agents/`.

### Backend (Python)
* **Style Guide:** Follow [PEP 8](https://peps.python.org/pep-0008/) guidelines.
* **Type Hinting:** Use Python type hints extensively to ensure the agent inputs/outputs are predictable.
* **Agent Design:** When creating or modifying agents (e.g., `marina_agent.py`, `finance_agent.py`), ensure they adhere to the established MCP and routing protocols defined in the architecture docs.
* **Documentation:** Write clear docstrings for all classes, methods, and complex logic blocks.

### General
* **Commit Messages:** Write clear, concise commit messages. Use conventional commits if possible (e.g., `feat: add new VHF radio channel`, `fix: resolve AIS target rendering bug`).

---

## Submitting Bug Reports

Bugs are tracked as GitHub issues. Before submitting a bug report, please check the existing issues to avoid duplicates.

When creating a bug report, include as much detail as possible:
1. **Title:** A clear, descriptive summary of the issue.
2. **Environment:** OS, Browser version, Node/Python versions.
3. **Steps to Reproduce:** Provide a step-by-step guide to reproduce the bug.
4. **Expected Behavior:** What did you expect to happen?
5. **Actual Behavior:** What actually happened? Include error messages, console logs, or screenshots if applicable.

---

## Proposing New Features

We welcome new ideas to expand Ada's capabilities! Since Ada is a complex multi-agent system, new features often require architectural consideration.

1. **Open a Discussion/Issue:** Before writing any code, open an issue labeled `enhancement` or `feature-request`.
2. **Describe the Use Case:** Clearly explain *why* this feature is needed and *who* it benefits (e.g., Captains, General Managers, Guests).
3. **Architectural Impact:** Briefly describe how this affects the existing agent mesh. Does it require a new agent? Does it modify the `wim_rules.json`?
4. **Wait for Feedback:** Maintainers will review the proposal, suggest modifications, and approve it for development.

---

## Pull Request Process

1. **Fork the repository** and create your branch from `main`.
   * Branch naming convention: `feat/your-feature-name` or `fix/issue-description`.
2. **Write your code** following the [Coding Standards](#coding-standards).
3. **Test your changes** to ensure you haven't broken existing functionality.
4. **Update documentation** if your changes affect the architecture, APIs, or user workflows (check the `docs/` folder).
5. **Submit a Pull Request (PR)**:
   * Reference any related issues (e.g., "Fixes #123").
   * Provide a clear summary of the changes.
   * A maintainer will review your PR, request changes if necessary, and merge it once approved.

Welcome aboard, and thank you for helping build the future of maritime intelligence!
