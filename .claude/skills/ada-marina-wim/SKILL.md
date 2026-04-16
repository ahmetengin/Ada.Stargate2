# Ada.marina.wim Skill

This skill provides high-level operations logic for **West Istanbul Marina**.

## Capabilities
- **Traffic Analysis:** Queries simulated Kpler AIS data.
- **Weather:** Checks local sensors.
- **Legal/Rules:** Looks up specific operational regulations.

## Usage
Use this skill when:
- Planning safe departure or arrival windows
- Checking if a boat is allowed to perform a maneuver (fueling, repairs, noise)
- Summarizing current traffic + weather for the captain

## Tools
Internally it calls the `ada.marina.wim` MCP server tools:
- `marina_status_snapshot`
- `marina_ais_nearby`
- `marina_weather_now`
- `marina_check_rule`
