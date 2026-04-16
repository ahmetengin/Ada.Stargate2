# Telemetry Layer for S/Y Phisedelia

This directory is reserved for the NMEA 2000 / SignalK integration layer.
It will contain scripts and configurations for:

-   **Reading:** Real-time sensor data from the NMEA2000 bus (GPS, wind, depth, speed, etc.).
-   **Parsing:** Converting raw NMEA/SignalK data into structured formats.
-   **Writing:** Sending commands back to the NMEA2000 bus for autonomous control (e.g., autopilot, sail trim actuators).
-   **Processing:** Running low-latency data fusion and anomaly detection directly on the vessel.