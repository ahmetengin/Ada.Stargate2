# Maritime VHF Radio Monitoring and Hardware Setup (RTL-SDR)

## Overview
The **marine VHF band**, by international standards, is located in the **156-174 MHz** range. It is used for ship-to-ship, ship-to-shore communication, and emergency calls. The most critical frequency is **Channel 16 (156.800 MHz)**, the emergency channel.

**RTL-SDR (Software Defined Radio)** devices cover this frequency range, offering a low-cost and effective **receive-only** solution. In the Ada ecosystem, the `ada.vhf` node's physical ears are built upon this hardware.

---

## 🛠️ Hardware Setup

### 1. RTL-SDR Dongle
*   **Recommended Model:** RTL-SDR Blog V3 or V4.
*   **Why:** It has a TCXO crystal, which prevents frequency drift and ensures stable operation when heated. Standard cheap dongles can lose frequency when they warm up.

### 2. Antenna Selection
The small stock antennas are inadequate for the marine band (156 MHz).
*   **Best Option:** Marine-type **1/4 wave** or **5/8 wave** vertical antenna.
    *   *Examples:* Sirio GP 160, Diamond NR-770.
*   **DIY Alternative:** A 1/4 wave Ground Plane antenna made from a 48 cm wire.

### 3. Cabling
*   **Cable:** Low-loss RG-58 or RG-213 coaxial cable.
*   **Connector:** Usually SMA (Dongle side) and N-Type or SO-239 (Antenna side).

### 4. LNA (Optional)
*   If the signal is weak, an RTL-SDR Blog Wideband LNA or a dedicated Marine VHF LNA can be used. (It receives power via the dongle with the Bias-Tee feature).

---

## 💻 Software Setup

### Windows
*   **SDR# (SDRSharp):** The most popular tool.
*   **Setting:** Select modulation as **NFM** (Narrow FM). Set bandwidth to 12.5 kHz or 25 kHz.
*   **Plugin:** Install the "Frequency Manager Suite" to save the channel list below.

### Linux / Mac (Raspberry Pi - Ada Node)
*   **GQRX:** For a graphical interface.
*   **rtl_fm:** For streaming audio via the command line (ideal for Ada's automation).
*   **AIS-catcher:** For plotting AIS data on a map.

---

## 📡 Turkey Marine VHF Frequency Table

The following channels are actively used along the Turkish coasts:

| Channel | Frequency (MHz) | Purpose | Type |
| :--- | :--- | :--- | :--- |
| **16** | **156.800** | **DISTRESS, SAFETY and CALLING** (Must be continuously monitored) | Simplex |
| **72** | **156.625** | **Marina Operations** (WIM, Ataköy etc.) / Ship-to-Ship | Simplex |
| **73** | **156.675** | Ship-to-Ship Communication (Popular among yachters) | Simplex |
| **09** | 156.450 | Fishermen, Ship-to-Ship, Search and Rescue | Simplex |
| **06** | 156.300 | Search and Rescue (Air-Sea cooperation) | Simplex |
| **08** | 156.400 | Coast Guard (Can often be encrypted/digital) | Simplex |
| **67** | 156.375 | Meteorology and Navigational Warnings (Türk Radyo) | Simplex |
| **70** | 156.525 | DSC (Digital Selective Calling - *No voice*) | Digital |

---

## 🤖 Additional Features (AIS & DSC)

### AIS (Automatic Identification System)
To see the position of vessels on a map:
*   **Frequencies:** 161.975 MHz and 162.025 MHz.
*   **Software:** `AIS-catcher` or `aisdeco2`.
*   **Ada Integration:** `ada.sea` nodes process this data to create the "Fleet Map".

### DSC (Digital Selective Calling)
*   **Frequency:** 156.525 MHz (Channel 70).
*   **Software:** `YAND` or `Multipsk`.
*   Digitally captures distress signals.

---

## ⚠️ Legal Disclaimer
Listening to marine VHF broadcasts with an RTL-SDR (for amateur/coastal safety purposes) is legal. However:
1.  Recording and publishing private conversations without permission is a crime (KVKK/GDPR).
2.  **TRANSMITTING IS NOT POSSIBLE** with these devices. They are receivers only.

*Document Date: 2024 - Ada Maritime Docs*