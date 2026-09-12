# Herd Guardian

Build a complete, polished, working **web software prototype** called **MastiPredict** for a college internal hackathon.

## 1. Project Context

Problem Statement:

**SIH26109 — AI-Based Predictive Modelling for Early Forecasting of Bovine Mastitis in Indian Dairy Farms**

Mastitis is an udder infection in cows and buffaloes. Current detection often happens after visible/clinical symptoms appear. The proposed system aims to provide an **early warning of mastitis risk 7–14 days in advance** by combining milk, animal behaviour, body temperature, and environmental signals.

The prototype should demonstrate the complete workflow:

**Animal → Sensor Data → Personal Baseline → Deviation → Velocity → Acceleration → Multi-Signal Fusion → Risk Forecast → Explainable Alert → Farmer Recommendation**

IMPORTANT:

This is a **hackathon prototype**, not a clinically validated medical/veterinary system.

Do NOT claim that the model has been clinically validated or that the displayed prediction accuracy is real.

---

# 2. Main Goal

Create a highly polished interactive dashboard that makes it look and feel like a real early-warning system.

The judges should be able to:

1. View the whole herd

2. Select an individual cow/buffalo

3. View sensor readings

4. View its personal baseline

5. See deviations from baseline

6. See velocity and acceleration of deviations

7. See 7-day and 14-day risk forecasts

8. See confidence score

9. See risk trajectory

10. See reasons behind the prediction

11. See recommended actions

12. Simulate changing sensor conditions

13. See the risk score change dynamically

14. View herd risk clusters

15. View sensor health

16. Switch language

17. Use the dashboard on a laptop/tablet/mobile

---

# 3. Technology Stack

Use:

* React

* Vite

* TypeScript

* Tailwind CSS

* Recharts for graphs

* Lucide React for icons

* LocalStorage for persistence

* No external database required

* No authentication required

* No external API required

* No internet dependency after the application loads

If possible, keep the entire project runnable with:

npm install

npm run dev

Do not create unnecessary backend infrastructure.

---

# 4. UI Design

Create a professional **AgriTech + AI dashboard**.

Design characteristics:

* Clean

* Modern

* Professional

* Simple enough for farmers

* Impressive enough for hackathon judges

* Responsive

* Use cards, charts, badges and clear status indicators

* Avoid excessive animations

* Avoid clutter

Use a dashboard layout with:

### Left sidebar

Logo:

**🐄 MastiPredict**

Menu:

* Dashboard

* Herd Monitoring

* Animal Analysis

* Risk Forecast

* Risk Map

* Alerts

* Sensor Health

* Settings

### Top bar

Show:

* Farm name

* Current date/time

* Offline/Online status

* Language selector

* Notification icon

---

# 5. Dashboard Page

Create a main dashboard containing:

### Summary cards

**Total Animals**

20

**High Risk**

2

**Moderate Risk**

4

**Low Risk**

14

**Herd Risk**

27%

Show suitable icons and status indicators.

---

# 6. Herd Monitoring Table

Create realistic demo data for at least 12 animals.

Example:

| ID   | Animal  | Breed   | Milk Yield | EC  | Temperature | Activity | Risk |

| ---- | ------- | ------- | ---------- | --- | ----------- | -------- | ---- |

| C024 | Cow     | HF      | 10.7 L     | 4.9 | 39.3°C      | 6640     | 84%  |

| C018 | Cow     | Gir     | 11.8 L     | 4.5 | 38.9°C      | 7200     | 62%  |

| C011 | Cow     | Sahiwal | 13.2 L     | 4.1 | 38.5°C      | 8300     | 18%  |

| C031 | Buffalo | Murrah  | 8.9 L      | 4.0 | 38.4°C      | 7900     | 7%   |

Use different realistic values for the remaining animals.

Risk categories:

* 0–20% = Low

* 21–40% = Mild

* 41–60% = Moderate

* 61–80% = High

* 81–100% = Very High

Allow the user to click an animal.

---

# 7. Individual Animal Page

When the user selects Cow C024, show:

## Cow C024

Breed: Holstein Friesian

Status:

**VERY HIGH RISK**

### Forecast

7-Day Risk:

**84%**

14-Day Risk:

**91%**

Confidence:

**High**

Trend:

**↑ Rapidly Increasing**

---

# 8. Personal Baseline Section

This is one of the MOST IMPORTANT features.

Show:

### Personal Baseline vs Current

| Parameter        | Personal Baseline | Current   | Deviation |

| ---------------- | ----------------- | --------- | --------- |

| Milk Yield       | 12.4 L            | 10.7 L    | -14%      |

| Milk EC          | 4.2 mS/cm         | 4.9 mS/cm | +16%      |

| Activity         | 8200              | 6640      | -19%      |

| Body Temperature | 38.5°C            | 39.3°C    | +0.8°C    |

Add a small explanation:

> "MastiPredict compares each animal with its own historical baseline instead of using only a fixed threshold."

This should be visually prominent.

---

# 9. Deviation Velocity

Create a section called:

### Deviation Dynamics

Show:

* Current deviation

* Velocity

* Acceleration

Example:

Milk EC:

Deviation: +16%

Velocity:

+2.8% / day

Acceleration:

+0.7% / day²

Activity:

Deviation: -19%

Velocity:

-3.2% / day

Acceleration:

-0.9% / day²

Add a simple explanation:

> "Velocity measures how quickly the signal is moving away from the animal's normal baseline."

> "Acceleration identifies whether that deviation is increasing faster."

---

# 10. Risk Trajectory Graph

Use Recharts.

Create a line chart showing the animal's risk score over the previous 14 days.

Example:

Day -14 → 12%

Day -12 → 15%

Day -10 → 19%

Day -8 → 25%

Day -6 → 33%

Day -4 → 48%

Day -2 → 67%

Today → 84%

Forecast:

Day +7 → 84%

Day +14 → 91%

Clearly distinguish:

**Historical Risk**

and

**Forecast Risk**

Add label:

> "Risk trajectory: Rapidly increasing"

---

# 11. Explainable AI Card

Create a prominent card:

### Why is C024 at high risk?

Show the top 4 reasons:

🔴 Milk EC increased by 16%

🔴 Milk yield decreased by 14%

🔴 Activity decreased by 19%

🟠 Body temperature increased by 0.8°C

Then display:

> "Multiple independent signals are deviating from the animal's personal baseline."

Do NOT say these factors diagnose mastitis.

Call them:

**Risk indicators**

---

# 12. Multi-Signal Confirmation

Create a component:

### Multi-Signal Confirmation

Signals detected:

✓ Milk EC abnormal

✓ Milk yield declining

✓ Activity declining

✓ Temperature increasing

Status:

**4 / 4 signals abnormal**

Then:

> "Persistent multi-signal deviation increases the system's confidence in the warning."

---

# 13. Farmer Recommendation

Create:

### Recommended Action

For High/Very High risk:

**Immediate**

* Perform CMT screening

* Check udder condition

* Observe milk appearance/quality

* Monitor the animal closely

**Preventive**

* Review milking hygiene

* Check udder cleanliness

* Check milking equipment hygiene

**Veterinary**

* Consult a veterinarian if abnormalities are confirmed

Add a disclaimer:

> "MastiPredict provides an early-warning risk assessment and does not replace veterinary diagnosis."

---

# 14. Sensor Simulation

THIS IS CRITICAL FOR THE HACKATHON DEMO.

Create a page/card:

## Live Sensor Simulator

Buttons:

**Normal Condition**

**Early Warning**

**High Risk**

When the user clicks "Normal Condition":

Example values:

Milk EC = 4.2

Milk Yield = 12.4 L

Activity = 8200

Temperature = 38.5°C

Risk should become approximately:

**18%**

When the user clicks "Early Warning":

Milk EC = 4.5

Milk Yield = 11.7 L

Activity = 7500

Temperature = 38.8°C

Risk:

**45–60%**

When the user clicks "High Risk":

Milk EC = 4.9

Milk Yield = 10.7 L

Activity = 6640

Temperature = 39.3°C

Risk:

**84%**

The UI must update dynamically.

Animate the numerical changes slightly.

Show:

**Sensor → Processing → Prediction**

---

# 15. IMPORTANT: Risk Calculation

For the prototype, implement a transparent DEMO risk calculation rather than pretending to have a clinically trained ML model.

Create a simple weighted scoring system using normalized deviation values:

* Milk EC: 30%

* Milk Yield: 25%

* Activity: 20%

* Body Temperature: 15%

* Environmental/THI: 10%

Then apply additional modifiers for:

* persistent deviation

* velocity

* acceleration

* number of abnormal signals

Clamp final risk to 0–100.

Label this internally as:

**Prototype Risk Engine**

Do NOT claim this is a clinically validated prediction model.

Structure the code so that this risk engine can later be replaced with an XGBoost/LightGBM model trained on real veterinary data.

---

# 16. Confidence Score

Display:

**Confidence: High — 92%**

But clearly label this as:

**Prototype confidence score**

Calculate it based on:

* number of available signals

* sensor health

* persistence

* multi-signal agreement

Example:

4 healthy sensors + 4 agreeing signals:

High confidence

2 healthy sensors + conflicting signals:

Medium confidence

Missing/faulty sensors:

Low confidence

---

# 17. Sensor Health Page

Create:

### Sensor Health

| Sensor           | Status     | Last Reading |

| ---------------- | ---------- | ------------ |

| Milk EC          | 🟢 Good    | 2 min ago    |

| Milk Temperature | 🟢 Good    | 2 min ago    |

| Body Temperature | 🟢 Good    | 3 min ago    |

| Activity         | 🟢 Good    | 1 min ago    |

| Milk Yield       | 🟠 Warning | 8 min ago    |

Add:

**Overall Sensor Health: 92%**

Create a "Simulate Sensor Fault" button.

When clicked, one sensor becomes:

🔴 Faulty

and the confidence score decreases.

---

# 18. Herd Risk Cluster Detection

Create a page called:

### Herd Risk

Display a simple farm layout.

Example:

SHED A

🟢 C011

🟢 C018

🔴 C024

🟠 C031

SHED B

🟢 C017

🟢 C022

🟢 C028

If multiple high-risk animals are in the same shed, display:

> ⚠️ Cluster detected

> "Multiple elevated-risk animals are located in Shed A. Review common environmental and hygiene factors."

This demonstrates the proposed herd-level analysis.

---

# 19. Risk Map

Create a simple visual farm map, NOT real GIS.

Use rectangular shed blocks with animal circles.

Colors:

Green = Low

Orange = Moderate

Red = High

Allow clicking animals to open their profile.

Title:

**Farm Risk Map**

Subtitle:

**Visual overview of animal-level risk**

---

# 20. Alerts Page

Create example alerts.

### 🔴 High Risk — C024

"Multiple risk indicators detected."

### 🟠 Moderate Risk — C018

"Milk EC and activity are deviating from baseline."

### 🟢 Monitoring — C011

"Risk stable."

Allow marking alerts as:

* New

* Acknowledged

* Resolved

---

# 21. Multilingual Support

Add language selector:

**English | हिन्दी | தமிழ்**

At minimum translate:

* Dashboard

* High Risk

* Moderate Risk

* Low Risk

* Recommended Action

* Alerts

* Animal

* Risk

* Sensor Health

The language selector should actually change visible UI labels.

---

# 22. Offline-First Simulation

Display a status indicator:

🟢 Online

or

🟠 Offline Mode

Create a toggle:

**Simulate Offline Mode**

When enabled:

> "Offline mode active — data stored locally."

Use LocalStorage to simulate local storage.

Create a small indicator:

**Pending Sync: 12 records**

Then a button:

**Sync Now**

After clicking:

**✓ All data synchronized**

This demonstrates the proposed offline-first architecture.

---

# 23. Data History

Create a history page showing the last 14 days for a selected animal.

Include:

* Milk yield

* EC

* Activity

* Temperature

* Risk score

Use charts.

Allow selecting:

**7 days / 14 days**

---

# 24. Add Demo Mode

Create a prominent button:

**🎬 Start Demo**

When clicked, automatically demonstrate:

1. Normal animal

2. Sensor values begin deviating

3. Risk increases

4. Multi-signal confirmation appears

5. Alert appears

6. Recommendation appears

The demo should take approximately 20–30 seconds.

This will be extremely useful during judging.

---

# 25. Navigation

All pages must actually work.

Required routes:

/dashboard

/herd

/animal/C024

/forecast

/risk-map

/alerts

/sensors

/settings

No dead buttons.

If a feature is not fully implemented, create a convincing prototype interaction rather than leaving an empty page.

---

# 26. Seed Data

Generate realistic synthetic data for:

20 animals

Include:

* Animal ID

* Species

* Breed

* Age

* Milk yield

* Milk EC

* Body temperature

* Activity

* Environmental temperature

* Humidity

* THI

* Personal baseline

* Deviation

* Velocity

* Acceleration

* Risk

* Confidence

* Shed

Use breeds such as:

* Holstein Friesian

* Jersey

* Gir

* Sahiwal

* Murrah

* Crossbred

Make the data varied.

Do NOT use real people's personal data.

---

# 27. Architecture Information Page

Add an "About System" section showing:

```text

Animal

   ↓

Sensors

   ↓

ESP32 Edge Node

   ↓

Data Cleaning

   ↓

Personal Baseline

   ↓

Deviation

   ↓

Velocity + Acceleration

   ↓

Multi-Signal Fusion

   ↓

Temporal Risk Engine

   ↓

7-Day / 14-Day Forecast

   ↓

Explainable Alert

   ↓

Farmer Action

```

Show the planned hardware:

* ESP32

* EC sensor

* DS18B20

* Load cell + HX711

* MPU6050

* BME280

* RFID

* microSD

Clearly label hardware as:

**Prototype/Planned Hardware Integration**

because this software demo is currently sensor-simulated.

---

# 28. Important Prototype Labeling

Put a small badge in the application:

**HACKATHON PROTOTYPE**

And somewhere:

> "Sensor values shown in Demo Mode are simulated. Field deployment requires real sensor integration, veterinary datasets and validation."

This prevents misleading claims.

---

# 29. Code Quality

Requirements:

* Clean component structure

* Reusable components

* TypeScript types

* No unnecessary dependencies

* No hardcoded repeated UI

* Responsive design

* No console errors

* No broken imports

* No placeholder lorem ipsum

* No unfinished TODO sections

* No dead links/buttons

Use mock data files so data can later be replaced by real API data.

---

# 30. Final Deliverable

The final application should feel like a **real AgriTech product prototype**, not a generic student dashboard.

The most impressive flow should be:

**Dashboard → C024 → Personal Baseline → Sensor Simulation → Risk increases → Explainable AI → Recommendation → Herd Risk Cluster**

Prioritize functionality and visual polish over backend complexity.

Build the application now.

After implementation:

1. Run the project

2. Check for compilation errors

3. Fix all errors

4. Check every route

5. Check responsive layout

6. Check all buttons

7. Check demo mode

8. Check sensor simulation

9. Check language switching

10. Give me the exact commands required to run it locally

Do not ask unnecessary questions. Make reasonable assumptions and complete the prototype end-to-end.



i want this website to connect to the supabase and add a page in the webite , the page need to contain the esp32 code and send data to the supabase from the EC sensor,DS18B20,Load cell + HX711,MPU6050,BME280,RFID

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fa317a92-6a3f-45cd-a7e8-c797a5bcba6b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
