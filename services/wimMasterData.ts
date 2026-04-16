// services/wimMasterData.ts

export const wimMasterData = {
  "identity": {
    "name": "West Istanbul Marina",
    "code": "WIM",
    "alias": "Beylikdüzü Marina",
    "operator": "Enelka Taahhüt İmalat ve Ticaret A.Ş.",
    "awards": ["5 Gold Anchors", "Blue Flag (10 Years Continuous)", "Zero Waste Certificate (Gold)"],
    "location": {
      "district": "Beylikdüzü",
      "neighborhood": "Yakuplu",
      "city": "Istanbul",
      "country": "Turkey",
      "coordinates": {
        "lat": 40.9628,
        "lng": 28.6636
      },
      "dedicated_locations": {
        "fuel_station": {
          "label": "Fuel Station (Lukoil)",
          "coordinates": { "lat": 40.9618, "lng": 28.6645 }
        },
        "customs_area": {
           "label": "Customs & Passport Control",
           "coordinates": { "lat": 40.9635, "lng": 28.6625 }
        }
      },
      "pontoons": [
          { "label": "Pontoon A", "relative_position": { "lng_offset": -0.002, "lat_offset": 0.001, "width_scale": 0.5, "length_scale": 4 } },
          { "label": "Pontoon B", "relative_position": { "lng_offset": -0.001, "lat_offset": 0.001, "width_scale": 0.5, "length_scale": 5 } },
          { "label": "Pontoon C", "relative_position": { "lng_offset": 0, "lat_offset": 0.001, "width_scale": 0.5, "length_scale": 5 } },
          { "label": "Pontoon D", "relative_position": { "lng_offset": 0.001, "lat_offset": 0.001, "width_scale": 0.5, "length_scale": 5 } },
          { "label": "VIP Quay", "relative_position": { "lng_offset": 0.002, "lat_offset": 0, "width_scale": 0.8, "length_scale": 6 } }
      ]
    },
    "vision": "To provide a clean, safe and agreeable living and working environment for Yachts and Owners.",
    "contact": {
      "vhf_channels": {
        "public": ["72", "16"],
        "internal_ops": ["14"],
        "vts_sectors": ["11", "12", "13"] 
      },
      "call_sign": "West Istanbul Marina",
      "phone": "+90 212 850 22 00"
    }
  },
  "hr_management": {
      "staff_count": 120,
      "departments": ["Operations", "Technical", "Security", "Front Office", "Cleaning"],
      "shift_pattern": "3 shifts (08-16, 16-24, 24-08)",
      "patrol_protocol": "Security must scan QR codes at 15 checkpoints every 2 hours."
  },
  "commercial_tenants": {
      "count": 45,
      "categories": ["Restaurants", "Boutiques", "Yacht Brokers", "Service Workshops"],
      "lease_model": "Fixed Rent + % Turnover Share",
      "common_area_charge_formula": "Total Cost / Total Leased Area * Tenant Area"
  },
  "analytics_data": {
      "historical_occupancy": { "2024_Q4": "88%", "2025_Q1": "75%", "2025_Q2": "92%" },
      "prediction_model": "Seasonal ARIMA",
      "what_if_scenarios_enabled": true
  },
  "strategic_partners": {
      "travel_agency": {
          "name": "Kites Travel & Concierge",
          "node": "ada.travel.kites",
          "license": "TÜRSAB Group A - 2648",
          "contract_type": "EXCLUSIVE SERVICE PROVIDER",
          "scope": [
              "Flight Ticketing (IATA)",
              "Hotel Reservations",
              "VIP Transfers (Land/Air)",
              "Daily Tours & Excursions",
              "Congress Logistics",
              "Yacht Charter Sales (Brokerage)"
          ],
          "legal_note": "West Istanbul Marina acts solely as a Marina Operator. All travel, tour, and ticketing services are legally executed and invoiced by Kites Travel in compliance with Law No. 1618."
      },
      "city_services": {
          "parking": {
              "provider": "ISPARK",
              "node": "ada.external.ispark",
              "agreement": "Strategic Partnership",
              "benefit": "Free/Discounted Exit for Marina Clients via Validation Code"
          }
      },
      "sailing_clubs": [
          { "name": "TAYK (Turkish Offshore Racing Club)", "role": "Race Organizer" },
          { "name": "IYK (Istanbul Sailing Club)", "role": "Partner" }
      ],
      "dining_partners": [
          { 
              "name": "Poem Restaurant", 
              "node": "ada.restaurant.poem", 
              "type": "Fine Dining", 
              "specialty": "Seafood & Mediterranean",
              "capabilities": ["Real-time Reservation", "Pre-Order Integration", "Yacht Delivery"] 
          },
          { 
              "name": "Fersah", 
              "node": "ada.restaurant.fersah", 
              "type": "Fish Restaurant", 
              "capabilities": ["Reservation"] 
          }
      ],
      "cross_border_partners": [
          {
              "name": "Manos",
              "location": "Symi",
              "node": "ada.restaurant.manos",
              "specialty": "Greek Taverna / Seafood",
              "docking": "Direct quay access available"
          },
          {
              "name": "Pantelis",
              "location": "Symi",
              "node": "ada.restaurant.pantelis",
              "specialty": "Traditional Greek",
              "docking": "Town quay"
          }
      ],
      "contract_perks": {
          "free_transfers": "3 per year (Airport <-> Marina)",
          "free_haul_out": "1 per year (max 7 days hardstanding)",
          "discount_fuel": "5% at WIM Lukoil",
          "free_parking": "Unlimited daily exit with Validation"
      },
      "partner_marinas": [
          { "name": "Alesta Yachting", "location": "Fethiye", "node": "ada.marina.alesta" },
          { "name": "D-Marin Göcek", "location": "Göcek", "node": "ada.marina.dmarisgocek" },
          { "name": "Setur Kaş", "location": "Kaş", "node": "ada.marina.setur_kas" },
          { "name": "Setur Ayvalık", "location": "Ayvalık", "node": "ada.marina.setur_ayvalik" },
          { "name": "Setur Kalamış", "location": "Istanbul", "node": "ada.marina.seturkalamis" },
          { "name": "Setur Mytilene", "location": "Lesvos, Greece", "node": "ada.marina.seturmidilli" },
          { "name": "Yacht Club de Monaco", "location": "Monaco", "node": "ada.marina.monacoyachtclub" }
      ],
      "federation_rules": {
          "cross_berthing_discount": 0.15, // 15% discount for network members
          "loyalty_recognition": true
      },
      "culinary_experience": {
          "partner": "Migros Jet Yacht Service",
          "capabilities": ["Provisioning List", "Delivery to Pontoon"]
      }
  },
  "facility_management": {
      "infrastructure": {
          "pedestals": { "count": 350, "type": "Smart Metered", "maintenance_cycle": "Monthly" },
          "fire_safety": { "hydrants": 45, "extinguishers": 120, "last_audit": "2025-10-01" },
          "fuel_tanks": { "diesel_capacity": 50000, "petrol_capacity": 10000, "sensor_type": "IoT Level" }
      },
      "environmental_compliance": {
          "zero_waste_certificate": "GOLD LEVEL",
          "blue_flag": {
              "status": "ACTIVE",
              "season": "2025",
              "sea_water_limits": {
                  "e_coli": "< 250 cfu/100ml",
                  "enterococci": "< 100 cfu/100ml"
              },
              "sampling_frequency": "15 Days (Ministry of Health)"
          },
          "waste_categories": [
              { "code": "BLUE", "type": "Paper/Cardboard" },
              { "code": "YELLOW", "type": "Plastic" },
              { "code": "GREEN", "type": "Glass" },
              { "code": "GREY", "type": "Metal" },
              { "code": "BLACK", "type": "Non-Recyclable / Domestic" },
              { "code": "ORANGE", "type": "Hazardous / Waste Oil / Batteries" }
          ],
          "reporting_authority": "Ministry of Environment & Urbanization (ECBS)",
          "tracking_system": "MoTAT (Mobile Hazardous Waste Tracking System)"
      },
      "hse_protocols": {
          "occupational_safety": "ISO 45001 Certified",
          "ppe_requirements": "Mandatory in Boatyard (Helmet, Vest, Shoes)",
          "emergency_response": "Drills conducted quarterly"
      }
  },
  "event_calendar": [
      { "id": "EVT-01", "name": "TAYK - Fahir Çelikbaş Cup", "date": "2025-05-15", "type": "Race", "organizer": "TAYK & WIM" },
      { "id": "EVT-02", "name": "WIM Hello Summer Party", "date": "2025-06-01", "type": "Social", "location": "Yacht Club Terrace" },
      { "id": "EVT-03", "name": "BoatFest 2025", "date": "2025-09-20", "type": "Fair", "location": "Main Breakwater" }
  ],
  "security_policy": {
    "authority": "ada.passkit (IAM Node)",
    "data_sovereignty": {
        "ada_sea": "Autonomous Node (Captain Owned). Internal telemetry (fuel, battery, interior) is PRIVATE. Cannot be queried by Marina.",
        "ada_marina": "Infrastructure Node. Shore power, water meter, CCTV (Public Areas), and Mooring data is VISIBLE.",
        "kvkk_status": "Strict Enforcement. Personal data is masked at rest and in transit."
    },
    "data_classification": {
      "PUBLIC (Level 0)": ["Vessel Name", "Hail Port", "ETA (Approx)", "VHF Channel", "AIS Position"],
      "PRIVATE (Level 1 - Captain Only)": ["Exact Location (Pontoon)", "Crew List", "Battery Status", "Fuel Level", "Provisions"],
      "RESTRICTED (Level 5 - GM)": ["Financial Debt", "Legal Disputes", "Full Telemetry History", "Security Logs"]
    },
    "vehicle_policy": {
        "dynamic_pool": "Members may register multiple vehicles. Only 1 active vehicle permitted inside per contract."
    },
    "protocols": {
      "kvkk_compliance": "Strictly enforce Article 20. No personal data on public channels (Ch 72).",
      "gdpr_compliance": "Right to be forgotten active. Data encryption required for Level 1+."
    }
  },
  "weather_station": {
      "node": "ada.weather.wim",
      "sources": [
          { "name": "Poseidon System", "region": "Aegean/Marmara", "priority": 1 },
          { "name": "Windy.com (ECMWF)", "type": "Global Model", "priority": 2 },
          { "name": "OpenWeatherMap", "type": "API", "priority": 3 }
      ],
      "alert_thresholds": {
          "small_craft_advisory": "Wind > 22 knots",
          "gale_warning": "Wind > 34 knots",
          "storm_warning": "Wind > 48 knots",
          "thunderstorm": "Lightning probability > 40%"
      },
      "reporting_protocol": {
          "frequency": "Daily 08:00 & 18:00 + On Demand",
          "format": "3-Day Outlook (Morning/Afternoon/Night)",
          "proactive_alert": "Broadcast immediately if thresholds exceeded."
      }
  },
  "assets": {
    "tenders": [
      { "id": "T-01", "name": "ada.sea.wimAlfa", "status": "Idle", "type": "Pilot/Tender" },
      { "id": "T-02", "name": "ada.sea.wimBravo", "status": "Idle", "type": "Pilot/Tender" },
      { "id": "T-03", "name": "ada.sea.wimCharlie", "status": "Maintenance", "type": "Technical/Rescue" }
    ] as any[],
    "charter_fleet": [
        { "id": "CH-01", "name": "M/Y WIM Prestige", "type": "Motor Yacht", "length": "24m", "capacity": 10, "status": "Available", "operator": "WIM", "sales_agent": "Kites" },
        { "id": "CH-02", "name": "S/Y Wind Chaser", "type": "Sailing Yacht", "length": "16m", "capacity": 6, "status": "Booked", "operator": "WIM", "sales_agent": "Kites" },
        { "id": "CH-03", "name": "VIP Transfer Boat", "type": "Speedboat", "length": "10m", "capacity": 4, "status": "Available", "operator": "WIM", "sales_agent": "Kites" }
    ],
    "capacities": {
        "total_area": "155.000 m2",
        "sea_berths": 600,
        "land_park": 300,
        "rack_park": "96 (up to 7m)",
        "hangars": "11 (up to 90m)",
        "hardstanding": "60.000 m2"
    },
    "berth_map": {
        "A": { "type": "Concrete", "tier": "PREMIUM", "max_loa": 25, "depth": 5.5, "capacity": 40, "status": "90%", "amenities": ["Fiber", "63A", "Pump-out"] },
        "B": { "type": "Concrete", "tier": "STANDARD", "max_loa": 20, "depth": 4.5, "capacity": 50, "status": "85%", "amenities": ["Fiber", "32A"] },
        "C": { "type": "Concrete", "tier": "STANDARD", "max_loa": 15, "depth": 4.0, "capacity": 60, "status": "FULL", "amenities": ["16A"] },
        "VIP": { "type": "Quay", "tier": "VIP", "max_loa": 90, "depth": 8.0, "capacity": 10, "status": "AVAILABLE", "amenities": ["Restricted Access", "125A", "Private Parking"] },
        "T": { "type": "T-Head", "tier": "PREMIUM", "max_loa": 40, "depth": 6.0, "capacity": 8, "status": "AVAILABLE", "amenities": ["Easy Maneuver", "63A"] }
    }
  },
  "legal_framework": {
    "governing_law": "Republic of Türkiye",
    "jurisdiction": "Istanbul Central Courts & Enforcement Offices (Article K.1)",
    "currency": "EUR",
    "payment_terms": "Advance Payment",
    "contract_types": ["Mooring", "Lifting", "Launching", "Dry Berthing"],
    "base_pricing": {
        "mooring_daily": 1.5, // EUR per m2 (Base Rate)
        "electricity": 0.35, // EUR per kW
        "water": 3.50 // EUR per m3
    },
    "pricing_multipliers": {
        "tiers": {
            "VIP": 2.5,      // 150% markup for VIP Quay
            "PREMIUM": 1.25, // 25% markup for T-Heads/Sea View
            "STANDARD": 1.0, // Base rate
            "ECONOMY": 0.85  // 15% discount for inner berths
        },
        "seasonality": {
            "HIGH": 1.2, // Summer
            "LOW": 0.8   // Winter
        }
    },
    "cross_border_protocols": {
        "greece": {
            "entry_ports": ["Chios", "Lesvos", "Samos", "Kos", "Rhodes", "Simi"],
            "requirements": ["Schengen Visa", "DEKPA (Transit Log)", "TEPAI (Tax)"],
            "flag_etiquette": "Greek courtesy flag on Starboard spreader."
        }
    }
  },
  "traffic_control": {
      "system_type": "ATC-Style Sequencing (Tower Control)",
      "holding_area": {
          "name": "Sector Zulu",
          "location": "1nm South of Breakwater",
          "rules": "Maintain 3 cables separation. Anchor ready."
      },
      "ambarli_integration": {
          "name": "Ambarlı Port Authority",
          "type": "Commercial Port",
          "traffic_types": ["Container Ship", "Tanker", "Ro-Ro"],
          "rules": "Pleasure craft must yield to commercial traffic > 50m.",
          "monitor_channel": "12"
      },
      "priority_hierarchy": [
          "LEVEL 1: Emergency (Mayday/Pan Pan) / State Vessels",
          "LEVEL 2: Medical Emergency / Fuel Critical",
          "LEVEL 3: Commercial Passenger Traffic (Scheduled Ferries)",
          "LEVEL 4: VIP / Superyachts (>40m) / High Value Assets",
          "LEVEL 5: Standard Pleasure Craft (Motor)",
          "LEVEL 6: Tenders / Jet Skis"
      ],
      "separation_rules": {
          "standard": "3 minutes separation at entrance",
          "heavy_traffic": "Hold outbound traffic for inbound heavy vessels",
          "conflict_resolution": "Lower priority vessel holds at Sector Zulu."
      },
      "emergency_broadcast_protocols": {
          "code_red": {
              "condition": "Fire / Collision / Explosion",
              "broadcast_tr": "EMERGENCY. ALL STATIONS. PORT IS CLOSED. HOLD YOUR PRESENT POSITION.",
              "broadcast_en": "EMERGENCY. ALL STATIONS. PORT IS CLOSED. HOLD YOUR PRESENT POSITION.",
              "action": "Block all traffic. Dispatch Fire Tenders."
          }
      }
  },
  "congress_management": {
      "node": "ada.congress.kites",
      "role": "Event Architect & Planner",
      "logistics_partner": "ada.travel.kites", // Outsourced to Agency
      "venues": [
          { "id": "V-01", "name": "WIM Grand Ballroom", "capacity": 500 },
          { "id": "V-02", "name": "Yacht Club Terrace", "capacity": 150 },
          { "id": "V-03", "name": "Mask Beach Arena", "capacity": 1000 }
      ],
      "partner_hotels": [
          { "name": "Kaya Ramada Plaza", "stars": 5, "dist": "2km" },
          { "name": "Hilton Garden Inn", "stars": 4, "dist": "4km" }
      ],
      "capabilities": ["Delegate Registration", "Badge Printing (PassKit)", "B2B Matchmaking"]
  },
  "maritime_authorities": {
      "KEGM": {
          "name": "Directorate General of Coastal Safety (TR)",
          "role": "VTS, Pilotage, Salvage, Towage",
          "comms": "VHF Ch 11/12/13 (VTS), Ch 16 (Emergency)"
      },
      "SG": {
          "name": "Turkish Coast Guard",
          "role": "Security, Border Control, SAR, Pollution Control",
          "comms": "VHF Ch 08 / 16"
      },
      "HCG": {
          "name": "Hellenic Coast Guard (GR)",
          "role": "Border Control, SAR in Greek Waters",
          "comms": "VHF Ch 12 (Olympia Radio) / 16"
      },
      "Liman_Baskanligi": {
          "name": "Ambarlı Harbour Master",
          "role": "Port State Control, Permissions, Anchor Areas",
          "comms": "VHF Ch 16 / Phone"
      }
  },
  "services": {
    "technical": {
      "travel_lift_major": "700 Ton Travel Lift (Mega Yachts)",
      "travel_lift_minor": "75 Ton Travel Lift",
      "haul_out": "Available (60.000m2 Hardstanding)",
      "pressure_wash": "Available",
      "bilgin_yachts": "Shipyard On-site"
    },
    "insurance_partners": [
        { "name": "Turk P&I", "type": "Local / Liability", "rating": "A+" },
        { "name": "Pantaenius", "type": "International / Hull", "rating": "AAA" },
        { "name": "Allianz Marine", "type": "General", "rating": "AA" }
    ],
    "amenities": {
      "restaurants": [
        "Poem Restaurant", "Port Of Point", "The Roof Kingdom Kitchen & Bar", "FERSAH RESTAURANT",
        "LAMORE BALIK - ET MANGALBAŞI", "ISKARMOZ RESTAURANT", "CALİSTO BALIK", "Can Samimiyet",
        "Seferi Ocakbaşı Meyhane", "Sade coffee & drink", "Mask Beach Music & Food", "ELLA ITALIAN",
        "Happy Moon's", "Deniz Kızı Şefin Yeri", "Zeytinlik Balık", "Pargalı Rum meyhanesi",
        "West Maya Marin", "Quki Meyhane", "Big Chefs", "İkitek Ocakbaşı", "Sefam Olsun Meyhane",
        "Spoint Meyhane", "Mavi Mey-hane", "Cümbüş Yeni Nesil Marina", "West Kanat", "Fısıltı Lounge"
      ],
      "lifestyle": [
        "Kumsal Istanbul Street", "Kumsal Beach", "Yacht Club", 
        "Mask Beach", "Paris Saint-Germain Academy Beylikdüzü"
      ],
      "sports": [
        "West Life Sports Club", "Fitness", "Sauna", "Indoor/Outdoor Pools", 
        "WEST Istanbul Marina Tennis Sports Club", "Basketball", "Football", "Sailing School (TYF/RYA)"
      ],
      "shopping": "Shopping Center & Market, BoatFest For-Sale Boat Pontoon",
      "electricity": "Metered (16A-63A) + Fiber Internet",
      "water": "Metered",
      "fuel": "Station Available (Duty-free subject to conditions)",
      "security": "24/7 Private Security + Helipad + Customs Gate",
      "parking": "ISPARK (Integrated) - 550 Car Capacity",
      "atm": "Garanti BBVA ATM"
    }
  },
  "penalties": {
    "late_departure": "4 EUR per m2 per day (Article H.3)",
    "pollution": "2x cost of cleaning + Municipal Fine (Article F.13)",
    "contract_breach": "Immediate Termination without refund"
  }
};