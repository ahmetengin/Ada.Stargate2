
# 🛠️ ADA SKILLS & MCP BUILDER ARCHITECTURE

**Concept:** "Code Execution with MCP" & "Skill Factories".
**Goal:** To allow Ada to generate her own tools and run them securely, reducing token usage and increasing reliability.

## 1. The "Skill Creator" Plugin
A meta-tool that allows Ada to scaffold new capabilities instantly.

### Command
```bash
ada skills create --name research.v1 --domain sea
```

### Output
Generates a folder structure automatically:
*   `skill.py`: The logic.
*   `context.md`: The specific knowledge.
*   `tests/`: Automated tests.
*   `hooks/`: Observability emitters.

## 2. MCP Builder (Model Context Protocol)
Ada uses the **FastMCP** pattern to build micro-servers.

### Philosophy: "Code Execution"
Instead of dumping raw JSON data into the chat context (which is expensive and slow), Ada writes a script to:
1.  Call the API (via MCP).
2.  Filter the data *in code*.
3.  Return only the specific answer.

### Template Architecture
```python
@tool()
def check_flight_availability(payload: dict) -> dict:
    """
    Code-exec friendly: run minimal external call(s) and return reduced data.
    The agent writes code that orchestrates these tools, not vice versa.
    """
    # 1. Call Amadeus API
    # 2. Filter for price < 500 EUR
    # 3. Return top 3 options only
    return filtered_results
```

## 3. Observability Hooks (The Nervous System)
Every Skill and MCP tool is hooked into the **Observer Dashboard**.
*   **Flow:** `Agent` -> `Hook Script` -> `HTTP POST` -> `Bun Server` -> `SQLite` -> `Vue Dashboard`.
*   **Metrics:** Latency, Token Usage, Error Rate, Domain Heatmap.

## 4. Implementation Status
*   **Skill Factory:** Ready for deployment.
*   **MCP Templates:** Defined for 'FastMCP' and 'Python Exec'.
*   **Observer:** Integrated with `claude-code-hooks-multi-agent-observability`.
