
# 📜 COLREGS & TURKISH STRAITS NAVIGATION RULES

**Reference:** Convention on the International Regulations for Preventing Collisions at Sea, 1972 (COLREGs) & Turkish Straits Maritime Traffic Regulations.

---

## ⚓️ PART A: COLREGS (Critical Rules for Ada)

Ada nodes (`ada.sea.*`) must strictly adhere to these rules during autonomous navigation logic.

### Rule 5: Look-out (Gözcülük)
*   **Requirement:** Every vessel shall at all times maintain a proper look-out by sight and hearing as well as by all available means appropriate (Radar, AIS).
*   **Ada Logic:** "Sensors Active 360°. Visual + Radar + AIS correlation confirmed."

### Rule 6: Safe Speed (Emniyetli Hız)
*   **Requirement:** Every vessel shall at all times proceed at a safe speed so that she can take proper and effective action to avoid collision.
*   **Ada Logic:** "In WIM Marina: 3 Knots. In Bosphorus: Max 10 Knots. Visibility < 0.5nm: Reduce speed immediately."

### Rule 7: Risk of Collision (Çatışma Riski)
*   **Requirement:** Proper use shall be made of radar equipment if fitted and operational, including long-range scanning to obtain early warning of risk of collision.
*   **Ada Logic:** "Tracking Target A. CPA (Closest Point of Approach) < 0.5nm. RISK DETECTED."

### Rule 13: Overtaking (Yetişme)
*   **Rule:** Any vessel overtaking any other shall keep out of the way of the vessel being overtaken.
*   **Ada Logic:** "I am overtaking. I must keep clear. The vessel ahead is the Stand-on vessel."

### Rule 15: Crossing Situation (Aykırı Geçiş)
*   **Rule:** When two power-driven vessels are crossing so as to involve risk of collision, the vessel which has the other **on her own starboard side** shall keep out of the way.
*   **Ada Logic:** "Target on Starboard (Sancak). RED LIGHT visible. I am 'Give-way' (Yol Veren). Action: Alter course to starboard, pass astern."

### Rule 18: Responsibilities between Vessels
*   **Hierarchy (Who gives way to whom):**
    1.  Power-driven vessel (Motorlu Tekne) **GIVES WAY TO:**
    2.  Sailing vessel (Yelkenli)
    3.  Vessel engaged in fishing (Balıkçı)
    4.  Vessel restricted in her ability to maneuver (RAM - Manevrası Kısıtlı)
    5.  Vessel not under command (NUC - Kumanda Altında Olmayan)

---

## 🌊 PART B: TURKISH STRAITS (ISTANBUL & CANAKKALE)

The Turkish Straits are one of the most difficult waterways in the world due to strong currents (Ortaakıntı, Orkoz), sharp turns, and heavy traffic.

### 1. TSVTS (Turkish Straits Vessel Traffic Service)
*   **Authority:** VTS Center (Gemi Trafik Hizmetleri).
*   **Sectors (Istanbul):**
    *   **Turkeli:** North Entrance (Black Sea).
    *   **Kavak:** Upper Bosphorus.
    *   **Kandilli:** Critical Turn (80 degrees).
    *   **Kadikoy:** South Entrance (Marmara).
*   **Communication:** VHF Channel **11** (North), **12** (South/Marmara), **13** (Bosphorus Center), **14** (Safety).

### 2. Traffic Separation Scheme (TSS)
*   **Rule:** Navigation is strictly within the designated lanes.
*   **Direction:** Keep to the starboard side of the fairway.
*   **Crossing:** Crossing the lanes is prohibited except in emergencies or designated zones, and must be done at a 90-degree angle.

### 3. Critical Constraints
*   **Max Speed:** 10 Knots over ground (SOG).
*   **Currents:** Surface currents can reach 4-6 knots (North to South). Undercurrents flow South to North.
*   **Overtaking:** Prohibited in critical turns (Kandilli, Yeniköy).
*   **Visibility:** Traffic suspended if visibility drops below 0.5 nm.

### 4. Reporting Points (SP - Sektör Raporu)
*   Vessels > 20m must report via VHF to the relevant sector when entering.
*   **Format:** "Turkeli VTS, this is [Vessel Name], entering TSS from North, Destination WIM."

### 5. Pilotage (Kılavuz Kaptan)
*   **Status:** Strongly recommended for foreign yachts and vessels > 500 GT. Mandatory for certain hazardous cargoes.
*   **Ada Logic:** "Entering Bosphorus. Recommendation: Request Pilot due to heavy traffic."

---

## 💡 ADA ENFORCEMENT EXAMPLES

**Scenario:** High-speed craft approaching from Starboard bow in Marmara Sea.
*   **Ada Analysis:** Rule 15 applies. Danger of Collision exists.
*   **Ada Action:** "Alter course to Starboard. Do not cross ahead."

**Scenario:** Entering Bosphorus from South.
*   **Ada Analysis:** Entering Sector Kadikoy. Monitor VHF Ch 12. Speed Limit 10 kts. Keep Starboard.