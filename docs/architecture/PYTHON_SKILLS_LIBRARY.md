# 🧠 ADA.MARINA: PYTHON SKILLS LIBRARY (BEYOND-MCP)

This document contains the **Production-Ready Python Scripts** for the Ada Stargate Ecosystem.
These scripts represent the **"Procedural Memory"** (Skills) of the AI Agents. They are designed to be executed by a **Worker** node in a secure sandbox (Docker/E2B).

**Architecture:** `User Request -> Router -> Expert (MCP) -> Worker (Executes these scripts)`

---

## 📂 1. MARINA OPERATIONS & SAFETY

### `smart_berth_allocation.py`
*Calculates the optimal berth based on vessel dimensions, live wind data, and maneuvering difficulty.*

```python
import json
import math

def calculate_optimal_berth(vessel_data, weather_data, marina_map):
    """
    vessel_data: { "loa": 20.4, "beam": 5.6, "draft": 4.5, "type": "Sailing Yacht" }
    weather_data: { "wind_speed": 22, "wind_dir": "NW" }
    """
    score_matrix = []
    
    for pontoon in marina_map['pontoons']:
        score = 100
        
        # 1. Length Constraint
        if vessel_data['loa'] > pontoon['max_loa']:
            continue # Impossible
            
        # 2. Wind Factor (Cross-wind docking is hard)
        # Simplified physics: If wind is perpendicular to pontoon heading, reduce score
        wind_angle_diff = abs(weather_data['wind_dir_deg'] - pontoon['heading'])
        if 45 < wind_angle_diff < 135 and weather_data['wind_speed'] > 15:
            score -= 30 # Hard docking
            
        # 3. Maneuverability (T-Heads are easier for big boats)
        if vessel_data['loa'] > 18 and pontoon['type'] != 'T-HEAD':
            score -= 20
            
        # 4. Premium Factor
        if pontoon['tier'] == 'VIP':
            score += 10 # Prefer VIP for high value assets
            
        score_matrix.append({ "berth": pontoon['id'], "score": score })
        
    # Return best match
    best_berth = sorted(score_matrix, key=lambda x: x['score'], reverse=True)[0]
    return json.dumps(best_berth)

if __name__ == "__main__":
    # Mock Inputs
    vessel = {"loa": 24.0, "beam": 6.0, "draft": 2.2, "type": "Motor Yacht"}
    weather = {"wind_speed": 18, "wind_dir_deg": 310} # NW
    map_data = {"pontoons": [
        {"id": "A-Head", "max_loa": 25, "heading": 0, "type": "T-HEAD", "tier": "PREMIUM"},
        {"id": "B-12", "max_loa": 20, "heading": 90, "type": "FINGER", "tier": "STANDARD"}
    ]}
    print(calculate_optimal_berth(vessel, weather, map_data))
```

### `guardian_protocol.py`
*Emergency Response Coordinator. Analyzes wind to predict smoke spread and assigns rescue assets.*

```python
import json

def emergency_response_plan(incident):
    """
    incident: { "type": "FIRE", "location": "Pontoon A", "lat": 40.963, "lng": 28.662 }
    """
    wind_dir = "NW" # Blowing South-East
    
    # 1. Identify Risk Zone (Downwind)
    risk_zone = "Pontoon B and Fuel Dock" if wind_dir == "NW" else "Breakwater"
    
    # 2. Asset Dispatch
    assets = {
        "wimCharlie": "FIRE_MONITOR_1", # Fire boat
        "wimAlpha": "EVACUATION_SUPPORT",
        "Security": "PERIMETER_LOCKDOWN"
    }
    
    # 3. Action Plan
    plan = {
        "status": "CODE_RED",
        "evacuate": risk_zone,
        "assets_deployed": assets,
        "radio_broadcast": "MAYDAY RELAY. FIRE ON PONTOON A. ALL VESSELS CLEAR FAIRWAY."
    }
    
    return json.dumps(plan, indent=2)

if __name__ == "__main__":
    print(emergency_response_plan({"type": "FIRE", "location": "Pontoon A"}))
```

### `marina_radar_sweep.py`
*Filters AIS targets to detect incoming traffic and commercial conflicts (Ambarlı).*

```python
from geopy.distance import geodesic

def radar_sweep(center_lat, center_lng, radius_nm, ais_targets):
    detected = []
    ambari_conflict = False
    
    for target in ais_targets:
        dist = geodesic((center_lat, center_lng), (target['lat'], target['lng'])).nm
        
        if dist <= radius_nm:
            detected.append(target)
            
            # Commercial Traffic Conflict Check
            if target['type'] in ['Cargo', 'Tanker'] and dist < 2.0:
                ambari_conflict = True
                
    return json.dumps({
        "vessels_count": len(detected),
        "conflict_alert": ambari_conflict,
        "targets": detected
    })
```

---

## 📂 2. FINANCE & COMMERCIAL

### `finance_invoice_engine.py`
*Generates accurate invoices based on vessel area (m²) and service type.*

```python
import json
from datetime import datetime

def generate_invoice(vessel, service_type, duration_days):
    # WIM Pricing Rules (Mock)
    BASE_RATE_M2 = 1.5 # EUR
    VAT = 0.20
    
    area = vessel['loa'] * vessel['beam']
    
    if service_type == 'MOORING':
        net_total = area * BASE_RATE_M2 * duration_days
    elif service_type == 'LIFTING':
        net_total = area * 12.0 + 350 # Base lift fee
    else:
        net_total = 100.0
        
    gross_total = net_total * (1 + VAT)
    
    invoice = {
        "inv_id": f"INV-{int(datetime.now().timestamp())}",
        "vessel": vessel['name'],
        "service": service_type,
        "breakdown": {
            "area_m2": round(area, 2),
            "rate": BASE_RATE_M2,
            "days": duration_days
        },
        "total_eur": round(gross_total, 2)
    }
    return json.dumps(invoice, indent=2)

if __name__ == "__main__":
    v = {"name": "Phisedelia", "loa": 20.4, "beam": 5.6}
    print(generate_invoice(v, "MOORING", 30))
```

### `commercial_cam_calculator.py`
*Calculates Common Area Maintenance (CAM) charges for commercial tenants.*

```python
def calculate_cam(tenant_area, total_leasable_area, total_operating_cost):
    share_percentage = tenant_area / total_leasable_area
    cam_charge = total_operating_cost * share_percentage
    
    return json.dumps({
        "share_pct": round(share_percentage * 100, 2),
        "cam_charge_eur": round(cam_charge, 2)
    })
```

### `finance_insurance_quote.py`
*Simulates live quoting from insurance APIs.*

```python
def get_insurance_quote(vessel_value, vessel_type):
    # Mock Rates
    rates = {
        "Sailing Yacht": 0.0065,
        "Motor Yacht": 0.0075,
        "Catamaran": 0.0080
    }
    
    rate = rates.get(vessel_type, 0.01)
    premium = vessel_value * rate
    
    return json.dumps({
        "provider": "Turk P&I",
        "hull_value": vessel_value,
        "premium_eur": premium,
        "deductible": vessel_value * 0.01
    })
```

---

## 📂 3. TECHNICAL & FACILITY

### `technic_blue_card.py`
*Manages waste discharge logging for environmental compliance.*

```python
def process_blue_card(vessel_id, card_id, waste_liters):
    # In prod, this calls the Ministry of Environment API
    transaction_id = f"ENV-{card_id}-99"
    
    return json.dumps({
        "status": "SUCCESS",
        "transaction": transaction_id,
        "vessel": vessel_id,
        "discharged_liters": waste_liters,
        "next_mandatory_discharge": "14 Days"
    })
```

### `technic_maintenance_scheduler.py`
*Schedules Travel Lift operations avoiding conflicts.*

```python
def schedule_lift(vessel, requested_date, current_schedule):
    # Check capacity (Max 4 lifts per day)
    day_load = len([x for x in current_schedule if x['date'] == requested_date])
    
    if day_load >= 4:
        return json.dumps({"status": "DENIED", "reason": "Slot Full"})
        
    # Check Weight
    lift_capacity = 700 if vessel['weight'] > 75 else 75
    
    return json.dumps({
        "status": "CONFIRMED",
        "date": requested_date,
        "assigned_equipment": f"{lift_capacity}T Travel Lift"
    })
```

### `facility_zero_waste.py`
*Generates aggregated waste reports.*

```python
def zero_waste_report(waste_logs):
    totals = {"plastic": 0, "paper": 0, "glass": 0, "oil": 0}
    
    for log in waste_logs:
        totals[log['type']] += log['kg']
        
    total_kg = sum(totals.values())
    recycling_rate = (total_kg - totals.get('domestic', 0)) / total_kg if total_kg > 0 else 0
    
    return json.dumps({
        "certificate": "GOLD",
        "recycling_rate_pct": round(recycling_rate * 100, 1),
        "breakdown": totals
    })
```

---

## 📂 4. ADMIN & PROTOCOLS

### `pre_departure_audit.py`
*The final gatekeeper. Checks Debt, Legal, and Technical status.*

```python
def audit_for_departure(vessel_id):
    checks = {
        "finance": True, # No Debt
        "legal": True,   # Contract Valid
        "technic": True, # No Blue Card Violation
        "weather": True  # Safe conditions
    }
    
    # Mock Fail
    checks['finance'] = False # Simulating debt
    
    passed = all(checks.values())
    
    return json.dumps({
        "cleared": passed,
        "checks": checks,
        "block_reason": "Outstanding Balance" if not passed else None
    })
```

### `congress_delegate_ops.py`
*Manages event delegates and badging.*

```python
def register_delegate(name, company, event_id):
    badge_id = f"DEL-{hash(name) % 10000}"
    return json.dumps({
        "status": "REGISTERED",
        "badge_id": badge_id,
        "access_level": "ALL_ACCESS",
        "passkit_url": f"https://wallet.wim.network/{badge_id}"
    })
```

### `hr_shift_manager.py`
*Tracks security patrols.*

```python
def check_patrol_status(checkpoints, logs):
    missed = []
    for cp in checkpoints:
        if cp not in logs:
            missed.append(cp)
            
    status = "GREEN" if not missed else "AMBER"
    return json.dumps({
        "status": status,
        "compliance_pct": (len(checkpoints) - len(missed)) / len(checkpoints) * 100,
        "missed_points": missed
    })
```
