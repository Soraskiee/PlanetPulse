# PlanetPulse 🌱

A simple personal carbon footprint tracker built for the hackathon.

PlanetPulse helps users log everyday activities, estimate their CO₂ emissions, track progress toward a weekly target, and understand their footprint over time.

## Features

- Log activities such as car travel, bus travel, flights, electricity usage, and meals
- Automatic CO₂ emission calculation using predefined emission factors
- Weekly carbon footprint dashboard
- Weekly target and progress tracking
- History with activity and date filters
- Weekly trend visualization
- Streaks and weekly challenges
- Practical sustainability tips when the weekly target is exceeded

## CO₂ Emission Factors

| Activity | Factor |
|---|---:|
| Car | 0.20 kg CO₂/km |
| Bus | 0.08 kg CO₂/km |
| Flight | 0.25 kg CO₂/km |
| Electricity | 0.80 kg CO₂/kWh |
| Vegetarian meal | 0.5 kg CO₂/meal |
| Non-vegetarian meal | 2.0 kg CO₂/meal |

## Tech Stack

- HTML
- CSS
- JavaScript
- Local browser storage for user preferences and streak/challenge state

## Running Locally

1. Clone the repository.
2. Open `index.html` in a browser.
3. Start logging activities and set a weekly target.

## Hackathon

**Track:** PlanetPulse — Personal Carbon Footprint

**Hackathon ID:** AZIS-QDJKNW

**Test credentials:** None required. The application does not use authentication.

## Project Structure

```text
PlanetPulse/
├── index.html
├── style.css
├── script.js
├── README.md
└── DECISIONS.md
