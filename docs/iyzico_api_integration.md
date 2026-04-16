# ⚙️ Iyzico API Integration for Ada.finance

**Reference:** [Iyzico API Documentation](https://developer.iyzico.com/) - *Conceptual Integration*

---

## 1. Overview

This document outlines the conceptual integration of Iyzico's API within Ada's `ada.finance.wim` node. Iyzico, as a prominent payment gateway in Turkey, serves as a critical external system for securely processing payments from marina clients.

Ada's `financeAgent` utilizes a simulated "Model Context Protocol" (MCP) to interact with these functionalities, allowing for secure payment initiation and confirmation without direct, real-time API calls in this prototype environment. This approach is designed to be easily extensible to a live API integration in a production environment.

---

## 2. Key API Endpoints and Data Models (Conceptual)

The `ada.finance` node primarily interacts with Iyzico's API through the following conceptual endpoints and data structures:

### A. Payment Link Generation

This functionality is crucial for creating secure payment links that can be sent to clients (vessels) for settling invoices.

*   **Endpoint (Simulated):** `POST /payment/auth` (for standard payment requests)
*   **Purpose:** To generate a new payment link for a specific invoice amount.
*   **Request Data Model (`PaymentLinkGenerateRequest`):**
    ```json
    {
      "locale": "en",
      "conversationId": "INV-0001",
      "price": "850.00",
      "paidPrice": "850.00",
      "currency": "EUR",
      "basketId": "BASKET-12345",
      "paymentGroup": "PRODUCT",
      "callbackUrl": "https://ada.marina.wim/payment/callback?invoiceId=INV-0001",
      "enabledCardInstallments": [1],
      "buyer": {
        "id": "buyer-vessel-imo",
        "name": "S/Y",
        "surname": "Phisedelia",
        "gsmNumber": "+905xx1234567",
        "email": "captain@phisedelia.com",
        "identityNumber": "11111111111",
        "lastLoginDate": "2025-11-15 10:00:00",
        "registrationDate": "2025-01-01 12:00:00",
        "registrationAddress": "West Istanbul Marina",
        "ip": "192.168.1.100",
        "city": "Istanbul",
        "country": "Turkey",
        "zipCode": "34000"
      },
      "shippingAddress": { /* ... */ },
      "billingAddress": { /* ... */ }
    }
    ```
*   **Response Data Model (`PaymentLinkGenerateResponse`):**
    ```json
    {
      "status": "success",
      "paymentPageUrl": "https://www.iyzico.com/checkout/form?token=abcdef12345",
      "token": "abcdef12345",
      "systemTime": 1678886400000,
      "conversationId": "INV-0001"
    }
    ```

### B. Payment Notification and Confirmation (Webhook Simulation)

This allows Ada to receive notifications when a payment has been successfully completed via the generated link. In a production environment, this would typically be a webhook.

*   **Endpoint (Simulated - Ada's internal):** `POST /payment/notification`
*   **Purpose:** To confirm a payment receipt and reconcile it with an outstanding invoice.
*   **Request Data Model (`IyzicoPaymentNotification`):**
    ```json
    {
      "paymentId": "PAY-123456789",
      "invoiceId": "INV-0001",
      "status": "SUCCESS",
      "paymentAmount": "850.00",
      "currency": "EUR",
      "transactionDate": "2025-11-20 14:30:00",
      "vesselImo": "987654321"
    }
    ```

### C. Refund Processing

For scenarios requiring refunds (e.g., reservation cancellation, overpayment), this endpoint would be utilized.

*   **Endpoint (Simulated):** `POST /payment/refund`
*   **Purpose:** To process a refund for a specific payment.

---

## 3. Ada Agent Integration within `ada.finance.wim`

The `financeAgent` encapsulates the logic for interacting with these conceptual APIs:

*   **`financeAgent.process(params: { intent: 'create_invoice', ... }, user: UserProfile)`:**
    *   **Task:** After an invoice is created via Parasut.com, this function simulates generating a secure payment link using Iyzico.
    *   **Function:** Simulates a `POST /payment/auth` call, creating a `paymentPageUrl`.
    *   **Result:** Returns an `AgentAction` object (`ada.finance.paymentLinkGenerated`) containing the payment link to the orchestrator.

*   **`financeAgent.confirmPayment(vesselName: string, paymentRef: string)`:**
    *   **Task:** Simulates the reception of an Iyzico payment notification (webhook) for a specific payment.
    *   **Function:** Internally updates the mock balance for the vessel to zero, sets its `paymentHistoryStatus` to `REGULAR`, and triggers updates to the `customerAgent` and `marinaAgent`.
    *   **Result:** Confirms payment clearance, triggering positive updates to the vessel's loyalty score via `ada.customer`.

---

## 4. Strategic Impact

Integrating with a payment gateway like Iyzico (even conceptually) allows Ada to:
1.  **Streamline Payment Collection:** Provide secure and convenient payment options directly to clients.
2.  **Automate Reconciliation:** Automatically update financial records and mark invoices as paid upon successful payment notification.
3.  **Enhance Customer Experience:** Offer a seamless payment process, contributing positively to customer satisfaction and loyalty.
4.  **Real-time Financial Status:** Ensure that `ada.finance` always has the most up-to-date information on outstanding debts and paid invoices.

This integration strengthens Ada's financial management capabilities, making it a comprehensive platform for marina operations.

---
**CRITICAL SECURITY & KVKK/GDPR DISCLAIMER:**

Ada's servers **DO NOT** store any sensitive credit card information. All payment processing is securely handled by Iyzico. Ada only receives payment confirmations. This approach ensures strict compliance with data protection regulations (KVKK/GDPR) and minimizes the marina's risk exposure.