# MastiPredict prototype and ESP32 sensor integration

## Outcome
Build a polished, responsive MastiPredict AgriTech dashboard for the hackathon, then connect its sensor-ingestion flow to Lovable Cloud so an ESP32 can send readings from the requested sensors.

## User-visible work
- Replace the blank home screen with the working MastiPredict dashboard and add the requested pages: dashboard, herd monitoring, animal analysis, forecast, risk map, alerts, sensor health, settings, history, and a new **Device Integration** page.
- Use realistic synthetic herd data for 20 animals, including personal baselines, deviations, velocity, acceleration, risk, confidence, shed, and environmental readings.
- Implement the transparent Prototype Risk Engine with weighted signals, modifiers, clamped risk, confidence scoring, risk trajectory charts, explainable indicators, recommendations, multi-signal confirmation, herd clusters, sensor health, offline simulation, local persistence, language switching, and a 20–30 second demo mode.
- Make the primary judging flow work end to end: dashboard → C024 → personal baseline → sensor simulator → increasing risk → explanation → recommendation → herd cluster.
- Keep all prototype disclaimers visible: simulated values, non-clinical warning, and planned hardware integration.

## Cloud and device integration
- Enable Lovable Cloud and create a public prototype sensor-ingestion table for ESP32 readings.
- Store the sensor payload needed for EC sensor, DS18B20, load cell + HX711, MPU6050, BME280, and RFID readings, together with device ID, animal ID, timestamp, and derived THI.
- Add the required explicit table grants, RLS policies, and indexes in the same migration. Keep the public prototype scope narrow and clearly label production device authentication as a future hardening step.
- Add a live data section that reads recent sensor records from Cloud, shows connection state, last reading, record count, and a refresh action. The dashboard will continue to work with demo data when no device has sent readings yet.
- Add the Device Integration page with:
  - sensor wiring/pin mapping for ESP32;
  - copyable Arduino-compatible code for all six sensor groups;
  - configuration fields for Cloud URL, publishable key, device ID, animal ID, and RFID tag;
  - a payload preview matching the table schema;
  - setup steps and a test-reading action;
  - a clear warning not to place service-role/private keys in firmware.
- Use the browser-safe publishable key in the generated firmware example and the Cloud REST endpoint, with input validation and user-friendly success/error states.

## Technical approach
- Follow the existing TanStack Start route structure; do not add another router or backend framework.
- Use reusable TypeScript data types, mock-data modules, dashboard primitives, charts, and shared navigation.
- Use Recharts and Lucide icons already present in the project; add no unnecessary dependencies.
- Use localStorage for UI preferences, simulator state, offline mode, pending sync, alert status, and demo progress. Use Cloud for incoming sensor records and recent-reading display.
- Add route-level metadata for each content page and preserve the existing root shell.
- Validate the implementation with a production build, the preview diagnostics, route checks, responsive checks, and interactive checks for simulator, demo mode, language switching, sensor fault, offline sync, and live sensor data.

## Safety and scope boundaries
- Do not claim clinical validation, diagnosis, real accuracy, or veterinary certainty.
- Treat all risk values and confidence values as prototype outputs.
- Do not store private credentials in the page or firmware. The firmware will use only the publishable client key; production deployments should add device authentication and rate limiting later.
- No authentication, payments, external API, or real GIS is required for this prototype.
