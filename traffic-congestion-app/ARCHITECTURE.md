# Application Architecture

## 📐 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (React)                    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    App.tsx                             │ │
│  │  - State Management (useState)                         │ │
│  │  - Data Processing (useMemo)                           │ │
│  │  - User Input Handling                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│         ▼                 ▼                 ▼               │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐            │
│  │ Analysis │     │Prediction│     │  Data    │            │
│  │   Tab    │     │   Tab    │     │ Sources  │            │
│  └──────────┘     └──────────┘     └──────────┘            │
└─────────────────────────────────────────────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Component Layer                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Congestion   │  │ Prediction   │  │    Data      │      │
│  │   Chart      │  │    Panel     │  │  Sources     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data & Logic Layer                         │
│                                                              │
│  ┌──────────────┐           ┌──────────────┐               │
│  │ trafficData  │           │  regression  │               │
│  │    .ts       │           │     .ts      │               │
│  │              │           │              │               │
│  │ - 150 data   │           │ - Linear     │               │
│  │   points     │────data──▶│   regression │               │
│  │ - 15 states  │           │ - Predictions│               │
│  │ - 10 years   │           │ - R² calc    │               │
│  └──────────────┘           └──────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Input → Processing → Output

```
User Input
    │
    ├─ Select State: "California"
    └─ Select Year: 2024
            │
            ▼
    ┌───────────────┐
    │  App.tsx      │
    │  useState     │
    └───────────────┘
            │
            ▼
    ┌───────────────┐
    │ getDataByState│
    │ (from data)   │
    └───────────────┘
            │
            ▼
    ┌───────────────┐
    │ Filter data   │
    │ for CA only   │
    └───────────────┘
            │
            ├──────────────┬──────────────┐
            ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │Calculate │   │Generate  │   │ Display  │
    │Regression│   │Predictions   │  Charts  │
    └──────────┘   └──────────┘   └──────────┘
            │              │              │
            ▼              ▼              ▼
        Display        Display        Display
        Equation       Forecast        Plot
```

## 🧩 Component Breakdown

### App.tsx (Main Controller)
```
┌──────────────────────────────────────┐
│           App Component              │
├──────────────────────────────────────┤
│ State:                               │
│  - selectedState                     │
│  - selectedYear                      │
├──────────────────────────────────────┤
│ Computed Values (useMemo):           │
│  - stateData                         │
│  - regression                        │
│  - predictions                       │
│  - currentYearData                   │
├──────────────────────────────────────┤
│ UI:                                  │
│  - Header                            │
│  - Control Panel (Selects)           │
│  - Tabs (Analysis/Predictions/Data)  │
│  - Footer                            │
└──────────────────────────────────────┘
```

### CongestionChart.tsx
```
┌──────────────────────────────────────┐
│      CongestionChart Component       │
├──────────────────────────────────────┤
│ Props:                               │
│  - data: StateData[]                 │
│  - regression: RegressionResult      │
│  - selectedYear: number              │
│  - stateName: string                 │
├──────────────────────────────────────┤
│ Displays:                            │
│  ├─ Regression Statistics (m, b, R²) │
│  ├─ Scatter Plot                     │
│  │   ├─ Historical points (blue)    │
│  │   ├─ Selected year (red star)    │
│  │   └─ Regression line (orange)    │
│  └─ Equation Display                 │
└──────────────────────────────────────┘
```

### PredictionPanel.tsx
```
┌──────────────────────────────────────┐
│      PredictionPanel Component       │
├──────────────────────────────────────┤
│ Props:                               │
│  - historicalData                    │
│  - predictions: Prediction[]         │
│  - stateName: string                 │
├──────────────────────────────────────┤
│ Displays:                            │
│  ├─ Key Metrics Cards                │
│  │   ├─ Current (2024)              │
│  │   ├─ Predicted (2029)            │
│  │   └─ % Change                    │
│  ├─ Line Chart                       │
│  │   ├─ Historical (solid blue)     │
│  │   └─ Predicted (dashed orange)   │
│  ├─ Predictions Table                │
│  └─ Warning Alerts                   │
└──────────────────────────────────────┘
```

## 📊 Data Structure

### StateData Interface
```typescript
interface StateData {
  state: string;            // "California"
  year: number;             // 2024
  populationDensity: number; // 259 people/sq mi
  congestionLevel: number;   // 81 hours/year
}
```

### RegressionResult Interface
```typescript
interface RegressionResult {
  slope: number;      // Rate of change (m)
  intercept: number;  // Y-intercept (b)
  rSquared: number;   // Fit quality (0-1)
}
```

### Prediction Interface
```typescript
interface Prediction {
  year: number;                  // 2025-2029
  populationDensity: number;     // Projected
  predictedCongestion: number;   // Forecast
}
```

## 🎯 Algorithm Flow

### Linear Regression Calculation

```
Input: Arrays of X and Y values
       X = [density₁, density₂, ..., densityₙ]
       Y = [congestion₁, congestion₂, ..., congestionₙ]

Step 1: Calculate Means
    xMean = Σxᵢ / n
    yMean = Σyᵢ / n

Step 2: Calculate Slope (m)
    numerator = Σ((xᵢ - xMean) × (yᵢ - yMean))
    denominator = Σ((xᵢ - xMean)²)
    slope = numerator / denominator

Step 3: Calculate Intercept (b)
    intercept = yMean - (slope × xMean)

Step 4: Calculate R²
    SS_total = Σ(yᵢ - yMean)²
    SS_residual = Σ(yᵢ - ŷᵢ)²
    R² = 1 - (SS_residual / SS_total)

Output: { slope, intercept, rSquared }
```

### Prediction Generation

```
Input: Historical data, years to predict

Step 1: Calculate Congestion Regression
    X = population densities
    Y = congestion levels
    Result: congestionModel { m₁, b₁, R² }

Step 2: Calculate Density Trend
    X = years [2015...2024]
    Y = densities [d₁...d₁₀]
    Result: densityModel { m₂, b₂ }

Step 3: Project Future Densities
    For year 2025:
        density₂₀₂₅ = m₂ × 2025 + b₂
    For year 2026:
        density₂₀₂₆ = m₂ × 2026 + b₂
    ...and so on

Step 4: Predict Future Congestion
    For each future year:
        congestion = m₁ × projected_density + b₁

Output: Array of Prediction objects
```

## 🔧 State Management Flow

```
User Action
    │
    ▼
onChange Handler
    │
    ▼
setState (React)
    │
    ▼
Component Re-render
    │
    ├─▶ useMemo (stateData) ─────▶ Filter dataset
    │
    ├─▶ useMemo (regression) ────▶ Calculate model
    │
    ├─▶ useMemo (predictions) ───▶ Generate forecast
    │
    └─▶ useMemo (currentYearData) ─▶ Find specific year
            │
            ▼
    Props passed to child components
            │
            ▼
    Components render with new data
```

## 📦 File Organization

```
src/
├── app/
│   ├── App.tsx                    [Main Controller]
│   │   • Manages state
│   │   • Orchestrates data flow
│   │   • Renders UI structure
│   │
│   ├── components/
│   │   ├── CongestionChart.tsx    [Visualization]
│   │   │   • Scatter plot
│   │   │   • Regression line
│   │   │   • Statistics display
│   │   │
│   │   ├── PredictionPanel.tsx    [Forecasting]
│   │   │   • Line chart
│   │   │   • Predictions table
│   │   │   • Metrics cards
│   │   │
│   │   ├── DataSources.tsx        [Documentation]
│   │   │   • Source links
│   │   │   • Integration guides
│   │   │   • Code examples
│   │   │
│   │   └── ui/                    [Reusable UI]
│   │       ├── select.tsx
│   │       ├── tabs.tsx
│   │       ├── card.tsx
│   │       └── ...
│   │
│   ├── data/
│   │   └── trafficData.ts         [Dataset]
│   │       • 150 data points
│   │       • Helper functions
│   │       • Type definitions
│   │
│   └── utils/
│       └── regression.ts          [Algorithms]
│           • Linear regression
│           • Prediction generation
│           • Statistical calculations
│
└── styles/                        [Styling]
    ├── index.css
    ├── tailwind.css
    └── theme.css
```

## 🎨 Rendering Pipeline

```
User Opens App
      │
      ▼
Load App.tsx
      │
      ▼
Initialize State
  • selectedState = "California"
  • selectedYear = 2024
      │
      ▼
Calculate Derived Data (useMemo)
  • stateData = getDataByState("California")
  • regression = calculateLinearRegression(...)
  • predictions = generateFuturePredictions(...)
      │
      ▼
Render Header
      │
      ▼
Render Control Panel
  • State dropdown
  • Year dropdown
  • Current info card
      │
      ▼
Render Tabs
  • Analysis Tab (default)
      │
      ▼
Pass Props to Components
      │
      ├─▶ CongestionChart
      │     • Renders scatter plot
      │     • Shows regression line
      │
      ├─▶ PredictionPanel
      │     • Renders line chart
      │     • Shows forecast table
      │
      └─▶ DataSources
            • Displays links
            • Shows guides
      │
      ▼
Render Footer
      │
      ▼
App Ready! 🎉
```

## 🔄 Update Cycle

```
User Changes State/Year
        │
        ▼
    onChange Event
        │
        ▼
    setState Called
        │
        ▼
React Detects Change
        │
        ▼
useMemo Recalculates
  (only affected values)
        │
        ▼
Child Components Receive
    New Props
        │
        ▼
Components Re-render
        │
        ▼
Charts Update
        │
        ▼
UI Shows New Data
```

## 💾 Memory Usage

```
Typical Memory Footprint:

App State (~1 KB)
├── selectedState: 20 bytes
├── selectedYear: 8 bytes
└── derived state: ~1 KB

Dataset (~10 KB)
├── trafficData: 150 × 64 bytes = ~10 KB
└── helper functions: negligible

Components (~50 KB)
├── React components: ~30 KB
├── Charts (Recharts): ~500 KB (loaded)
└── UI components: ~20 KB

Total: ~550-600 KB
```

## 🚀 Performance Optimization

```
1. useMemo for expensive calculations
   ✓ Regression only recalculated when data changes
   ✓ Predictions cached until data changes

2. Component-level optimization
   ✓ Pure components where possible
   ✓ Minimal prop passing

3. Data loading
   ✓ Static data (no API latency)
   ✓ Small dataset (~10 KB)

4. Rendering
   ✓ Tab-based lazy rendering
   ✓ Conditional rendering of charts
```

---

## 🎯 Key Takeaways

1. **App.tsx** is the orchestrator - manages all state
2. **useMemo** prevents unnecessary recalculations
3. **Component isolation** - each component has single responsibility
4. **Type safety** - TypeScript interfaces ensure data consistency
5. **Data flow** is unidirectional (top-down)
6. **Calculations** are pure functions (no side effects)

This architecture provides:
- ✅ Maintainability
- ✅ Scalability
- ✅ Performance
- ✅ Type safety
- ✅ Testability
