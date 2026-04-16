# ⚙️ Garanti BBVA API Integration for Ada.finance

**Reference:** [Garanti BBVA API Documentation](https://api.garantibbva.com.tr/) - *Conceptual Integration*

---

## 1. Overview

This document outlines the conceptual integration of Garanti BBVA's API within Ada's `ada.finance.wim` node. As a primary banking partner, Garanti BBVA is a critical external system for `ada.finance` to monitor incoming payments, perform daily reconciliation, and potentially initiate outbound transactions.

Ada's `financeAgent` utilizes a simulated "Model Context Protocol" (MCP) to interact with these functionalities, allowing for banking operations to be conceptulized without direct, real-time API calls in this prototype environment. This approach is designed to be easily extensible to a live API integration in a production environment.

---

## 2. Key API Endpoints and Data Models (Conceptual)

The `ada.finance` node primarily interacts with Garanti BBVA's API through the following conceptual endpoints and data structures:

### A. Account Statement / Transaction History

This functionality is crucial for monitoring all incoming (and outgoing) transactions to the marina's primary bank accounts. This is the main tool for daily payment reconciliation.

*   **Endpoint (Simulated):** `GET /accounts/{account_id}/transactions`
*   **Purpose:** To fetch a list of transactions for a specific date range, typically for daily reconciliation.
*   **Request Parameters:**
    ```json
    {
      "accountId": "WIM_MAIN_ACCOUNT_TRY",
      "startDate": "2025-11-19",
      "endDate": "2025-11-20"
    }
    ```
*   **Response Data Model (`TransactionListResponse`):**
    ```json
    {
      "transactions": [
        {
          "transactionId": "TRN-BBVA-001",
          "date": "2025-11-20",
          "amount": 850.00,
          "currency": "EUR",
          "type": "CREDIT",
          "description": "Iyzico payment for INV-0001 (S/Y Phisedelia)",
          "reference": "INV-0001",
          "vesselImo": "987654321" // For internal matching
        },
        {
          "transactionId": "TRN-BBVA-002",
          "date": "2025-11-20",
          "amount": 1200.00,
          "currency": "EUR",
          "type": "CREDIT",
          "description": "Mooring payment for M/Y Blue Horizon",
          "reference": "INV-0002",
          "vesselImo": "123456789"
        }
      ],
      "totalCreditAmount": 2050.00,
      "totalDebitAmount": 0.00
    }
    ```

### B. Account Balance Inquiry

This provides the current real-time balance of the marina's accounts.

*   **Endpoint (Simulated):** `GET /accounts/{account_id}/balance`
*   **Purpose:** To check the current balance of a specific bank account.

### C. Payment Initiation

For scenarios where the marina needs to make outbound payments (e.g., supplier payments, refunds), this endpoint would be utilized. (Less critical for `ada.finance`'s initial scope).

*   **Endpoint (Simulated):** `POST /payments/transfer`
*   **Purpose:** To initiate a transfer from a marina account to another beneficiary.

---

## 3. Ada Agent Integration within `ada.finance.wim`

The `financeAgent` encapsulates the logic for interacting with these conceptual APIs:

*   **`financeAgent.fetchDailySettlement()`:**
    *   **Task:** Simulates fetching daily bank statements from Garanti BBVA.
    *   **Function:** Simulates a `GET /accounts/{account_id}/transactions` call for the current day.
    *   **Reconciliation:** Iterates through the fetched transactions. For each incoming payment that can be linked to a vessel (via reference or description), it internally triggers `financeAgent.processPayment` to mark the debt as settled and update loyalty scores.
    *   **Result:** Returns a summary report of daily transactions and any reconciled payments, to be displayed on the `Operations Deck`.

*   **`financeAgent.processPayment(vesselName: string, paymentRef: string)`:**
    *   **Task:** This skill (also triggered by Iyzico webhooks) can be internally triggered by the `fetchDailySettlement` skill upon identifying a payment from Garanti BBVA.
    *   **Function:** Marks the vessel's `outstandingDebt` as zero and updates its `paymentHistoryStatus` to `REGULAR`.
    *   **Result:** Triggers `AgentAction` objects for `ada.customer` (loyalty score update) and `ada.marina` (vessel profile update).

---

## 4. Strategic Impact

Integrating with Garanti BBVA's API (even conceptually) allows Ada to:
1.  **Automate Reconciliation:** Significantly reduce manual effort in matching bank transactions with invoices.
2.  **Real-time Cash Flow Monitoring:** Provide up-to-date information on the marina's financial inflows.
3.  **Proactive Financial Management:** Identify payments, clear debts, and update customer loyalty scores automatically, ensuring a seamless financial experience.
4.  **Operational Transparency:** Provide management with clear, concise daily financial summaries.

This integration completes the financial transaction loop within Ada, ensuring comprehensive financial oversight.

---
**CRITICAL SECURITY & KVKK/GDPR DISCLAIMER:**

Ada's servers **DO NOT** store any sensitive credit card information. All payment processing is securely handled by payment gateways like Iyzico. Bank transaction data is used solely for reconciliation purposes and is handled in strict compliance with data protection regulations (KVKK/GDPR).