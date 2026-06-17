# Traffic Density & Congestion Analysis

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22C55E?style=flat)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)

A React + TypeScript web app for analysing historical traffic congestion across 10 major Indian cities and predicting future trends using linear regression.

## Features

- **City & year selector** — pick from 10 Indian cities (2015–2024 data)
- **Congestion chart** — scatter plot with regression line, R² score, and highlighted year
- **Prediction panel** — 5-year forecasts (2025–2029) with percentage-change breakdown
- **Ranking table** — cities ranked by congestion level for any selected year
- **City comparison** — side-by-side bar charts across multiple cities
- **India map** — interactive choropleth showing congestion intensity by city
- **Year-over-year chart** — trend lines with anomaly detection (±1.8σ Z-score)
- **GDP correlation** — scatter plot of congestion vs. city-level GDP per capita
- **Peak / off-peak chart** — peak vs. off-peak congestion split per city
- **Infrastructure slider** — simulate the effect of infrastructure investment on congestion
- **Dark mode** — toggle between light and dark themes
- **CSV export** — download city data as a CSV file
- **Shareable URLs** — copy a link that pre-selects the current city and year

## Cities Covered

Delhi NCR · Gurugram · Mumbai · Bengaluru · Chennai · Hyderabad · Kolkata · Pune · Ahmedabad · Jaipur

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts 2 |
| UI primitives | Radix UI + shadcn/ui |
| Icons | Lucide React |
| Map | react-simple-maps |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5000)
npm run dev

# Production build → dist/
npm run build
```

## Project Structure

```
src/
└── app/
    ├── App.tsx                        # Root component, state management
    ├── components/
    │   ├── CongestionChart.tsx        # Scatter plot + regression line
    │   ├── PredictionPanel.tsx        # 5-year forecast chart + table
    │   ├── RankingTable.tsx           # City ranking by congestion
    │   ├── CityComparison.tsx         # Multi-city bar chart
    │   ├── IndiaMap.tsx               # Choropleth map
    │   ├── YearOverYearChart.tsx      # YoY trend + anomaly markers
    │   ├── GDPCorrelation.tsx         # GDP vs. congestion scatter
    │   ├── PeakOffPeakChart.tsx       # Peak/off-peak split
    │   ├── InfrastructureSlider.tsx   # Investment impact simulator
    │   ├── DataSources.tsx            # Data source references
    │   └── ui/                        # Radix/shadcn primitives
    ├── data/
    │   └── trafficData.ts             # Dataset (150 data points) + helpers
    └── utils/
        ├── regression.ts              # Least-squares regression, R², forecasting
        ├── anomaly.ts                 # Z-score anomaly detection
        └── export.ts                  # CSV export + URL share helpers
```

## Data Model

```typescript
interface StateData {
  state: string;            // City name
  year: number;             // 2015–2024
  populationDensity: number; // People per sq km
  congestionLevel: number;   // Hours of delay per commuter per year
  gdpPerCapita: number;      // USD, interpolated from city estimates
}
```

## Regression Model

Congestion is modelled as a linear function of population density using ordinary least squares:

```
congestion = m × populationDensity + b
```

R² (coefficient of determination) indicates model fit:

| R² range | Interpretation |
|---|---|
| > 0.7 | Strong fit — predictions are reliable |
| 0.4 – 0.7 | Moderate fit |
| < 0.4 | Weak fit — other factors dominate |

Future density is projected as a time-series trend, then fed into the regression model to generate 5-year forecasts.

## Deployment

**Vercel**
```bash
npx vercel
```

**Netlify / static host**
```bash
npm run build
# upload dist/ to your host
```

> **Note:** The vite dev server defaults to port 5000. Change `server.port` in `vite.config.ts` if needed.

## Disclaimer

Dataset is simulated based on real-world trends for demonstration purposes. Not intended for production policy use without integration of verified data sources.
