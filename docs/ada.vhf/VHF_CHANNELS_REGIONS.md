
# Regional Marina & Port Channel List and Automation Protocols (Cross-Border Edition)

**Date:** 20 November 2025  
**Status:** Current  
**Standard:** IMO SMCP (Standard Marine Communication Phrases) Compliant

This document defines which VHF channel the autonomous vessel nodes (`ada.sea.*`) in the Ada ecosystem should monitor based on their geographical location and how they should automatically respond to marina calls.

**Key Update:** Protocol now includes cross-border switching between Turkish and Greek operational channels.

---

## 📍 Regional Channel List (Geo-Fencing)

Ada nodes automatically set their "Primary Watch" channel to the following, based on their GPS location, in order of priority.

| Priority | Region | Channel | Frequency (MHz) | Typical Users |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Marmara Sea (HQ)** | **72** | 156.625 | West Istanbul Marina, Ataköy, Kalamış |
| **2** | **Bosphorus Strait** | **12** | 156.600 | VTS Istanbul (Sector Kandilli/Kadikoy) |
| **3** | **North Aegean (TR)** | **73** | 156.675 | Ayvalık, Dikili |
| **4** | **North Aegean (GR)** | **12/71** | Various | **Lesvos (Mytilene)**, Chios |
| **5** | **Central Aegean (TR)** | **72** | 156.625 | Çeşme, Alaçatı Port, Sığacık |
| **6** | **Central Aegean (GR)** | **12** | 156.600 | **Chios**, Samos (Pythagoreio) |
| **7** | **South Aegean (TR)** | **71** | 156.600 | Bodrum, Yalıkavak, Turgutreis |
| **8** | **South Aegean (GR)** | **74** | 156.725 | **Kos**, **Rhodes (Mandraki)**, Simi |
| **9** | **Göcek – Fethiye** | **72** | 156.625 | Skopea Port, D-Marin Göcek |
| **10** | **Open Sea (Emergency)** | **16** | 156.800 | **Universal Hail & Distress** |

> **Note:** Channel 16 (156.800 MHz) is always monitored in the background in "Dual Watch" mode, regardless of the region.

---

## 🤖 Automated Operation Logic

The `ada.vhf` node follows this logical flow:

1.  **Location Determination:** Checks GPS position upon startup.
2.  **Jurisdiction Check:**
    *   If Longitude < Territorial Limit: Switch to **EU/Greek Protocol**.
    *   If Longitude > Territorial Limit: Switch to **TR Protocol**.
3.  **Continuous Listening:**
    *   When a signal is detected, the **OpenAI Whisper API** is activated.
4.  **Response Generation:**
    *   **TR Waters:** Turkish/English (SMCP).
    *   **GR Waters:** English (SMCP) is mandatory.

---

## 🗣️ Example Automated Responses (Cross-Border)

### Scenario 1: Approaching Chios (Greece)
**Port Police:** "Sailing Yacht Phisedelia, Chios Port Control on Ch 12."
**Ada (EN):** "Chios Port Control, this is Phisedelia. Reading you loud and clear. We are entering Greek territorial waters, requesting instructions for check-in. Over."

### Scenario 2: Returning to Turkey (Cesme)
**Marina:** "Phisedelia, Cesme Marina on Ch 72."
**Ada (TR):** "Çeşme Marina, burası Phisedelia. Türk karasularına giriş yaptık. Gümrük pontonuna yanaşma talimatı bekliyoruz. Tamam."

### Scenario 3: TEPAI Check (Greece)
**Port Authority:** "Phisedelia, confirm TEPAI payment status."
**Ada (EN):** "Affirmative. TEPAI has been paid online. Payment code: [Hash]. Documents available for inspection. Over."
