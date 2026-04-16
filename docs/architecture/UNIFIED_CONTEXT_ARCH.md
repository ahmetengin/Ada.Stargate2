
# 🧩 ADA UNIFIED CONTEXT ARCHITECTURE

**Objective:** To provide a persistent, domain-aware "Brain" for the Ada ecosystem that scales across 40+ domains (Sea, Marina, Travel, Congress, etc.).

## 1. The Problem
Without structured context, an agent is amnesiac. It relies on huge system prompts that consume tokens and confuse the model.

## 2. The Solution: Context Engineering Stack

### A. Directory Structure (`.claude/context/`)
Instead of one giant prompt, we have modular context files:
```text
.claude/
  context/
    meta.context.md      # The "Soul" of Ada (Principles, Safety)
    sea.md               # Nautical terms, COLREGs, Vessel specs
    marina.md            # WIM Regulations, Pricing, Tenders
    travel.md            # Flight rules, Hotel preferences
    congress.md          # Delegate rules, PassKit formats
```

### B. Skill-Aware Context
Every skill reads its own context *plus* the meta context.
*   `formatter.v1` reads `meta.context.md` (Tone)
*   `marina.lookup` reads `marina.md` (Rules)

### C. Domain Switching
The system supports instant context switching via Bash:
```bash
ada switch sea    # Loads sea.md + meta.context.md
ada switch travel # Loads travel.md + meta.context.md
```

## 3. Observability & Scoring
*   **Scoring AI:** Every interaction is scored.
*   **Feedback Loop:** High-latency or low-score interactions trigger a "Context Update" suggestion.
*   **Dashboard:** A centralized view of which context nodes are active.

## 4. The "Meta-Brain"
This architecture allows Ada to be:
1.  **Self-Managing:** She knows where to look for rules.
2.  **Cost-Efficient:** Only loads relevant context.
3.  **Persistent:** Learnings are written back to `.md` files, not lost in chat history.
