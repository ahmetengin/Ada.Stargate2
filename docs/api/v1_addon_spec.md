# Ada Add-on API Specification (v1)

**Endpoint Root:** `https://api.ada.wim/v1/`
**Authentication:** `X-API-Key` Header

This document outlines the API protocol for B2B partners like **Marindesk.com** to integrate Ada's "Headless AI" capabilities into their own applications.

---

## 1. Authentication

All requests must include a valid partner API key in the `X-API-Key` header.
- **Format:** `X-API-Key: MD_xxxxxxxxxxxxxxxx`

Keys are issued by the Ada Stargate administration.

---

## 2. Main Endpoint: `/addon/query`

This is the primary endpoint for processing user queries.

- **Method:** `POST`
- **URL:** `https://api.ada.wim/v1/addon/query`

### Request Body
```json
{
  "prompt": "S/Y Phisedelia için kalkış izni istiyorum.",
  "user_context": {
    "user_id": "marindesk_user_123",
    "vessel_imo": "987654321",
    "marina_id": "marindesk_gocek"
  },
  "session_id": "optional_session_id_for_history"
}
```
- `prompt` (string, required): The raw text query from the end-user.
- `user_context` (object, required): Information about the user and their context within the partner's system.
- `session_id` (string, optional): A unique ID to maintain conversation history for multi-turn dialogues.

### Response Body
The API returns a structured JSON response containing the processed result and any triggered actions.

```json
{
  "response_text": "**DEPARTURE DENIED**\n\nFinancial Hold Active. Outstanding: **€850.00**.",
  "intent_detected": "DEPARTURE_REQUEST",
  "confidence": 0.98,
  "triggered_actions": [
    {
      "action_name": "ada.finance.debt_check",
      "status": "COMPLETED",
      "result": {
        "balance": 850,
        "status": "DEBT"
      }
    }
  ],
  "trace_id": "trace_abc123"
}
```
- `response_text` (string): The formatted, user-facing response text that the partner application should display.
- `intent_detected` (string): The high-level intent classified by the Ada Orchestrator (e.g., `FINANCE_QUERY`, `EMERGENCY_ALERT`).
- `confidence` (float): The confidence score of the intent classification.
- `triggered_actions` (array): A log of the internal agent actions that were executed to generate the response. This is useful for debugging and providing richer context in the partner's UI.
- `trace_id` (string): A unique ID for this entire transaction, which can be used to reference logs in the Ada Observability dashboard.

---

## 3. Webhooks (Future)

For asynchronous operations (e.g., a long-running analysis or a pro-active alert from Ada), we will support webhooks.

- **Example Event:** `ada.marina.proactive_hail`
- **Payload:**
  ```json
  {
    "event_type": "proactive_hail",
    "vessel_imo": "987654321",
    "message": "West Istanbul Marina calling S/Y Phisedelia. We have you on radar at 20nm. Your berth is ready...",
    "timestamp": "2025-11-20T10:00:00Z"
  }
  ```

Partners will be able to register a secure webhook URL in their developer dashboard to receive these events.
