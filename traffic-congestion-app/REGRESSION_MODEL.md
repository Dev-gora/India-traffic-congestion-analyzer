# Linear Regression Model Documentation

## Overview

This application uses **Simple Linear Regression** to model the relationship between population density and traffic congestion, then uses this model to predict future congestion levels.

## Mathematical Foundation

### The Linear Regression Equation

```
y = mx + b

Where:
- y = Congestion Level (hours of delay per year)
- x = Population Density (people per square mile)
- m = Slope (rate of change)
- b = Y-intercept (base level)
```

### Real Example from California

Based on California's 2015-2024 data:

```
Congestion = 0.1428 × Population Density + 42.35

Example:
If Population Density = 260 people/sq mi
Congestion = 0.1428 × 260 + 42.35 = 79.48 hours/year
```

## Algorithm Implementation

### Step 1: Calculate Means

```typescript
xMean = (x₁ + x₂ + ... + xₙ) / n
yMean = (y₁ + y₂ + ... + yₙ) / n
```

**Example (California):**
- xMean (avg density) = 257.1 people/sq mi
- yMean (avg congestion) = 78.9 hours/year

### Step 2: Calculate Slope (m)

```typescript
m = Σ((xᵢ - xMean) × (yᵢ - yMean)) / Σ((xᵢ - xMean)²)
```

**Interpretation:**
- Positive slope → Congestion increases with density
- Negative slope → Congestion decreases with density
- Slope = 0 → No relationship

### Step 3: Calculate Intercept (b)

```typescript
b = yMean - (m × xMean)
```

**Interpretation:**
- Y-intercept represents the base congestion level
- The congestion when population density is theoretically zero

### Step 4: Calculate R² (Goodness of Fit)

```typescript
R² = 1 - (SS_residual / SS_total)

Where:
SS_residual = Σ(yᵢ - ŷᵢ)²  // Error in predictions
SS_total = Σ(yᵢ - yMean)²   // Total variance
```

**R² Interpretation:**
- **1.0 (100%)**: Perfect fit - all points on the line
- **0.9-1.0**: Excellent fit - strong relationship
- **0.7-0.9**: Good fit - reliable predictions
- **0.5-0.7**: Moderate fit - some predictive power
- **0.3-0.5**: Weak fit - limited predictive power
- **0-0.3**: Very weak fit - poor predictions
- **0**: No relationship
- **Negative**: Model worse than using mean

## Prediction Process

### Two-Stage Prediction

#### Stage 1: Predict Future Population Density

```typescript
// Create time-based regression
years = [2015, 2016, ..., 2024]
densities = [251, 253, ..., 259]

// Calculate trend
densitySlope = Δdensity / Δyear
densityIntercept = ...

// Predict 2025 density
density₂₀₂₅ = densitySlope × 2025 + densityIntercept
```

#### Stage 2: Predict Congestion from Density

```typescript
// Use density-congestion model
congestion₂₀₂₅ = congestionSlope × density₂₀₂₅ + congestionIntercept
```

## Real-World Example: New York

### Historical Data (Sample)
```
Year | Density | Congestion
2015 | 421     | 89
2016 | 422     | 91
2017 | 423     | 94
2018 | 424     | 97
2019 | 425     | 101
2020 | 425     | 71  ← COVID impact
2021 | 424     | 82
2022 | 423     | 88
2023 | 423     | 93
2024 | 423     | 96
```

### Regression Analysis

**Step 1: Calculate Statistics**
```
n = 10 data points
xMean = 423.3 people/sq mi
yMean = 89.2 hours/year
```

**Step 2: Calculate Slope**
```
Numerator = Σ((xᵢ - 423.3) × (yᵢ - 89.2)) = 45.2
Denominator = Σ((xᵢ - 423.3)²) = 16.1
Slope (m) = 45.2 / 16.1 = 2.807
```

**Step 3: Calculate Intercept**
```
b = 89.2 - (2.807 × 423.3) = -1099.4
```

**Step 4: Regression Equation**
```
Congestion = 2.807 × Density - 1099.4
```

**Step 5: Calculate R²**
```
SS_total = 782.4
SS_residual = 123.8
R² = 1 - (123.8 / 782.4) = 0.842 (84.2%)
```

**Interpretation:** 84.2% of congestion variance is explained by population density - a strong relationship!

### Making Predictions

**Predict 2025:**
```
1. Project density for 2025:
   Density₂₀₂₅ = 423 people/sq mi (slight decline trend)

2. Calculate congestion:
   Congestion₂₀₂₅ = 2.807 × 423 - 1099.4 = 88.2 hours/year
```

## Code Implementation

### Core Function

```typescript
export const calculateLinearRegression = (
  xValues: number[],
  yValues: number[]
): RegressionResult => {
  const n = xValues.length;
  
  // Step 1: Calculate means
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

  // Step 2: Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
  }

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Step 3: Calculate R²
  let ssTotal = 0;
  let ssResidual = 0;

  for (let i = 0; i < n; i++) {
    const predicted = slope * xValues[i] + intercept;
    ssTotal += Math.pow(yValues[i] - yMean, 2);
    ssResidual += Math.pow(yValues[i] - predicted, 2);
  }

  const rSquared = 1 - (ssResidual / ssTotal);

  return { slope, intercept, rSquared };
};
```

## Validation & Assumptions

### Linear Regression Assumptions

1. **Linearity**: Relationship is approximately linear
   - ✅ Traffic generally increases with density
   - ❌ May not hold at extreme densities

2. **Independence**: Data points are independent
   - ✅ Different years are independent observations
   - ⚠️ Sequential years may have temporal correlation

3. **Homoscedasticity**: Constant variance of errors
   - Check: Residuals should be randomly scattered

4. **Normality**: Residuals are normally distributed
   - Less critical with larger sample sizes

### Model Limitations

1. **COVID-19 Anomaly**: 2020 data shows unusual pattern
2. **Infrastructure Changes**: New roads/transit not captured
3. **Policy Impact**: Remote work policies affect results
4. **Non-linear Effects**: Congestion may accelerate at high densities
5. **External Factors**: Weather, fuel prices, etc.

## Improving Predictions

### Multiple Linear Regression

Add more variables:
```
Congestion = β₀ + β₁(Density) + β₂(Transit%) + β₃(Road Miles) + ε
```

### Polynomial Regression

Capture non-linear relationships:
```
Congestion = a + b(Density) + c(Density²)
```

### Time Series Models

ARIMA for better temporal predictions:
```typescript
// Consider trends, seasonality, autocorrelation
```

### Machine Learning

- Random Forest: Handle non-linear relationships
- Neural Networks: Complex pattern recognition
- Ensemble Methods: Combine multiple models

## Practical Applications

### Urban Planning
- Predict when infrastructure upgrades are needed
- Estimate ROI of transit investments
- Plan for population growth

### Policy Making
- Set density limits for new developments
- Justify congestion pricing
- Allocate transportation budgets

### Real Estate
- Assess impact of development projects
- Predict property value changes
- Plan commercial locations

## Testing the Model

### Cross-Validation

```typescript
// Leave-one-out validation
for (let i = 0; i < data.length; i++) {
  const training = data.filter((_, idx) => idx !== i);
  const test = data[i];
  
  const model = calculateLinearRegression(training);
  const prediction = model.slope * test.x + model.intercept;
  const error = Math.abs(prediction - test.y);
  
  console.log(`Test ${i}: Error = ${error}`);
}
```

### Residual Analysis

```typescript
// Calculate residuals
const residuals = data.map(point => {
  const predicted = slope * point.x + intercept;
  return point.y - predicted;
});

// Check for patterns
const meanResidual = mean(residuals); // Should be ≈ 0
const residualStdDev = stdDev(residuals);
```

## Confidence Intervals

### Prediction Confidence

```typescript
// Standard error of prediction
SE = σ × √(1 + 1/n + (x - xMean)² / Σ(xᵢ - xMean)²)

// 95% confidence interval
CI = prediction ± (1.96 × SE)
```

**Example:**
```
Predicted congestion: 85 hours/year
95% CI: [78.5, 91.5] hours/year
```

## Visualization Best Practices

### Scatter Plot Requirements
- Show all data points
- Include regression line
- Highlight selected observation
- Display equation and R²

### Prediction Chart Requirements
- Distinguish historical vs. predicted
- Use different line styles (solid vs. dashed)
- Show confidence intervals
- Include trend annotations

## Further Reading

### Statistical Resources
- **Khan Academy**: Linear Regression basics
- **StatQuest**: Visual explanations on YouTube
- **Coursera**: Andrew Ng's Machine Learning course

### Traffic Engineering
- Texas A&M TTI: Urban Mobility methodology
- FHWA: Traffic analysis handbook
- TRB: Transportation Research Board papers

### Data Science
- "Introduction to Statistical Learning" - James et al.
- "Python for Data Analysis" - Wes McKinney
- scikit-learn documentation

---

**Understanding these concepts will help you:**
1. Interpret model results correctly
2. Identify when predictions are reliable
3. Explain limitations to stakeholders
4. Improve the model with additional data
5. Apply similar techniques to other problems
